
using System.Data;
using Microsoft.EntityFrameworkCore;
using PuppeteerSharp;
using PuppeteerSharp.Media;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Utilities;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public enum Statement_Item_Type
{
    FEE = 1,
    DEPOSIT = 2,
    DISCOUNT = 3,
    REFUND = 4,
    REGISTRATION = 5,
    TUITION = 6
}

public class Statement_Reference
{
    public static string FEE = "FEE";
    public static string DEPOSIT = "DEPOSIT";
    public static string DISCOUNT = "DISCOUNT";
    public static string REFUND = "REFUND";
}

public enum Proof_Of_Deposit_Status
{
    PENDING = 1,
    APPROVED = 2,
    REJECTED = 3
}

public class FinancialStatementService
{
    private readonly SCA_ITSContext dbContext;
    private IViewRenderService _viewRenderService;
    private FilesToDeleteService filesToDeleteService;
    private readonly ILogger<FinancialStatementService> logger;

    public FinancialStatementService(SCA_ITSContext dbContext, IViewRenderService viewRenderService, FilesToDeleteService filesToDeleteService, ILogger<FinancialStatementService> logger)
    {
        this.dbContext = dbContext;
        this._viewRenderService = viewRenderService;
        this.filesToDeleteService = filesToDeleteService;
        this.logger = logger;
    }

    #region Statements

    /*----   GET FINANCIAL STATEMENT FOR PARENT   ----*/
    public async Task<Response> GetStatementForParent(int parentId)
    {
        try
        {
            var statement = await dbContext.ParentFinancialStatements.FirstOrDefaultAsync(pfs => pfs.ParentId == parentId);
            if (statement is null)
            {
                return new Response { errorMessage = "Not found", data = 404 };
            }

            return new Response { errorMessage = "", data = statement };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    /*----   GET FINANCIAL STATEMENT FOR PARENT AS PDF   ----*/
    public async Task<Response> GetStatementForParentAsPdf(int parentId)
    {
        try
        {
            // get parent
            var parentDetails = await (
                from user in dbContext.UserAccounts
                join parent in dbContext.Parents on user.UserId equals parent.UserId
                where user.UserId == parentId
                select new
                {
                    user.UserId,
                    user.FirstName,
                    user.LastName,
                    Address = $"{parent.PostalAddress}\n{parent.ResidentialAddress}"
                }
            ).FirstOrDefaultAsync();
            if (parentDetails is null)
                return new Response { errorMessage = "Parent Not found", data = 404 };

            // get statement
            var statement = await dbContext.ParentFinancialStatements.FirstOrDefaultAsync(pfs => pfs.ParentId == parentId);
            if (statement is null)
            {
                return new Response { errorMessage = "Statement Not found", data = 404 };
            }

            // get items
            var items = await dbContext.StatementItems.Where(item => item.StatementId == statement.ParentId).ToListAsync();

            // create statement object
            var financialStatement = new FinancialStatement()
            {
                firstName = parentDetails.FirstName,
                lastName = parentDetails.LastName,
                address = parentDetails.Address,
                date = DateOnly.FromDateTime(DateTime.Today).ToLongDateString(),
                CurrentBalance = statement.CurrentBalance,
                statementItems = items
            };

            // render html
            var html = await _viewRenderService.RenderToStringAsync("Statement", financialStatement);

            // generate pdf
            await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
            {
                Headless = true,
                ExecutablePath = "/usr/bin/google-chrome-stable"
            });
            await using var page = await browser.NewPageAsync();
            await page.EmulateMediaTypeAsync(MediaType.Screen);
            await page.SetContentAsync(html);
            var pdfContent = await page.PdfStreamAsync(new PdfOptions
            {
                Format = PaperFormat.A4,
                PrintBackground = true
            });

            return new Response { errorMessage = "", data = pdfContent };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }


    /*----   GET STATEMENT ITEMS FOR PARENT   ----*/
    public async Task<Response> GetStatementItemsForParent(int parentId)
    {
        try
        {
            var statementItems = await dbContext.StatementItems.Where(st => st.StatementId == parentId)
            .Select(st => new StatementItemGet()
            {
                Id = st.Id,
                date = st.Date.ToString("dd/MM/yyyy"),
                Reference = st.Reference,
                Description = st.Description,
                DebitAmount = st.DebitAmount,
                CreditAmount = st.CreditAmount
            })
            .ToListAsync();

            return new Response { errorMessage = "", data = statementItems };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    /*----   ADD FINANCIAL STATEMENT FOR PARENT   ----*/
    public async Task<Response> AddStatementForParent(int parentId)
    {
        try
        {
            // check if parent exists
            if (!await dbContext.Parents.AnyAsync(p => p.UserId == parentId))
                return new Response { errorMessage = "Parent not found", data = 404 };

            // check if statement already exists
            if (await dbContext.ParentFinancialStatements.AnyAsync(pfs => pfs.ParentId == parentId))
                return new Response { errorMessage = "Statement already exists", data = 409 };

            // create statement
            var record = new ParentFinancialStatement()
            {
                ParentId = parentId,
                CurrentBalance = 0,
            };

            // save to db
            await dbContext.ParentFinancialStatements.AddAsync(record);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    /*----   ADD FINANCIAL STATEMENT ITEM   ----*/
    public async Task<Response> AddStatementItem(AddStatementItem details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "Empty values", data = 400 };
            }


            // check if statement already exists
            var statement = await dbContext.ParentFinancialStatements.FirstOrDefaultAsync(pfs => pfs.ParentId == details.parentId);
            if (statement is null)
                return new Response { errorMessage = "Statement not found", data = 404 };

            var reference = "";

            // check for correct amounts depending on type and set reference
            switch (details.itemType)
            {
                case (int)Statement_Item_Type.DEPOSIT:
                    if (details.creditAmount <= 0)
                        return new Response { errorMessage = "Credit amount for deposits must be greater than 0", data = 400 };
                    if (details.debitAmount != 0)
                        return new Response { errorMessage = "Debit amount for deposits must be 0", data = 400 };

                    reference = $"DEPOSIT-{details.parentId}-{await dbContext.StatementItems.Where(si => si.StatementId == details.parentId).CountAsync() + 1}";
                    break;
                case (int)Statement_Item_Type.DISCOUNT:
                    if (details.creditAmount <= 0)
                        return new Response { errorMessage = "Credit amount for discounts must be greater than 0", data = 400 };
                    if (details.debitAmount != 0)
                        return new Response { errorMessage = "Debit amount for discounts must be 0", data = 400 };

                    reference = $"DISCOUNT-{details.parentId}-{await dbContext.StatementItems.Where(si => si.StatementId == details.parentId).CountAsync() + 1}";
                    break;
                case (int)Statement_Item_Type.REFUND:
                    if (details.creditAmount <= 0)
                        return new Response { errorMessage = "Credit amount for refunds must be greater than 0", data = 400 };
                    if (details.debitAmount != 0)
                        return new Response { errorMessage = "Debit amount for refunds must be 0", data = 400 };

                    reference = $"REFUND-{details.parentId}-{await dbContext.StatementItems.Where(si => si.StatementId == details.parentId).CountAsync() + 1}";
                    break;
                case (int)Statement_Item_Type.FEE:
                    if (details.creditAmount != 0)
                        return new Response { errorMessage = "Credit amount for fees must be 0", data = 400 };
                    if (details.debitAmount <= 0)
                        return new Response { errorMessage = "Debit amount for fees must be greater than 0", data = 400 };

                    reference = $"FEE-{details.parentId}-{await dbContext.StatementItems.Where(si => si.StatementId == details.parentId).CountAsync() + 1}";
                    break;
                case (int)Statement_Item_Type.REGISTRATION:
                    if (details.creditAmount != 0)
                        return new Response { errorMessage = "Credit amount for registration items must be 0", data = 400 };
                    if (details.debitAmount <= 0)
                        return new Response { errorMessage = "Debit amount for registration items must be greater than 0", data = 400 };

                    reference = $"REGISTRATION-{details.parentId}-{await dbContext.StatementItems.Where(si => si.StatementId == details.parentId).CountAsync() + 1}";
                    break;
                case (int)Statement_Item_Type.TUITION:
                    if (details.creditAmount != 0)
                        return new Response { errorMessage = "Credit amount for tuition must be 0", data = 400 };
                    if (details.debitAmount <= 0)
                        return new Response { errorMessage = "Debit amount for tuition must be greater than 0", data = 400 };

                    reference = $"TUITION-{details.parentId}-{await dbContext.StatementItems.Where(si => si.StatementId == details.parentId).CountAsync() + 1}";
                    break;

                default:
                    return new Response { errorMessage = "Invalid statement type", data = 400 };
            }

            // create statement item
            var record = new StatementItem()
            {
                StatementId = (int)details.parentId,
                Reference = reference,
                Description = details.description,
                Date = DateOnly.FromDateTime(DateTime.Today),
                CreditAmount = (decimal)details.creditAmount,
                DebitAmount = (decimal)details.debitAmount,
            };

            // save to db
            await dbContext.StatementItems.AddAsync(record);
            await dbContext.SaveChangesAsync();

            // update statement balance
            var result = await this.UpdateBalance(statement.ParentId, (decimal)details.creditAmount - (decimal)details.debitAmount);

            // if balance update failed, remove added statement item
            if (result.errorMessage != "")
            {
                dbContext.StatementItems.Remove(record);
                await dbContext.SaveChangesAsync();

                return result;
            }

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    #endregion

    #region Balance

    /// <summary>
    ///     updates the current balance of the financial statement of a parent by adding the amount passed in to the current balance.
    /// </summary>
    /// <param name="parentId">Id of the parent for which the balance is to be updated</param>
    /// <param name="amountToAdd">The amount to add to the balance. This value can be negative if the amount should be subtracted</param>
    /// <returns>Response object indicating success or failure</returns>
    private async Task<Response> UpdateBalance(int parentId, decimal amountToAdd)
    {
        try
        {
            var record = await dbContext.ParentFinancialStatements.FirstOrDefaultAsync(st => st.ParentId == parentId);
            if (record is null)
                return new Response { errorMessage = "Statement Not found", data = 404 };

            record.CurrentBalance += amountToAdd;

            dbContext.ParentFinancialStatements.Update(record);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }
    /*----   GET PARENT BALANCES   ----*/
    /// <summary>
    ///     Gets all registered parents and their account balances
    /// </summary>
    /// <returns>
    ///     List of parents with their account balances
    /// </returns>
    public async Task<Response> GetParentBalances()
    {
        try
        {
            var records = await (
                from p in dbContext.Parents
                join u in dbContext.UserAccounts on p.UserId equals u.UserId
                join f in dbContext.ParentFinancialStatements on p.UserId equals f.ParentId
                where p.RegistrationStage == (int)PARENT_REGISTRATION_STATUS.APPROVED
                select new
                {
                    u.UserId,
                    u.Email,
                    u.FirstName,
                    u.LastName,

                    f.CurrentBalance
                }
            ).ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }


    #endregion

    #region Proof of deposit

    /*----   GET PROOF OF DEPOSITS   ----*/
    public async Task<Response> GetProofOfDepositsForParent(int parentId)
    {
        try
        {
            var records = await dbContext.ProofOfDeposits.Where(pod => pod.ParentId == parentId).ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    /*----   ADD PROOF OF DEPOSIT   ----*/
    public async Task<Response> AddProofOfDeposit(AddProofOfDeposit details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "Empty values", data = 400 };
            }

            // check if parent exists
            if (!await dbContext.ParentFinancialStatements.AnyAsync(pfs => pfs.ParentId == details.parentId))
                return new Response { errorMessage = "Parent not found", data = 404 };

            // check if amount > 0
            if (details.amount <= 0)
                return new Response { errorMessage = "Amount should be greater than 0", data = 400 };

            ProofOfDeposit proofOfDeposit = new ProofOfDeposit()
            {
                ParentId = (int)details.parentId,
                Amount = (decimal)details.amount,
                Status = (int)Proof_Of_Deposit_Status.PENDING,
                FilePath = details.filePath,
                FileName = details.fileName,
                RejectionMessage = ""
            };

            await dbContext.ProofOfDeposits.AddAsync(proofOfDeposit);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    /*----   EDIT PROOF OF DEPOSIT   ----*/
    public async Task<Response> EditProofOfDeposit(EditProofOfDeposit details)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (details.id is null)
            {
                return new Response { errorMessage = "id is null", data = 400 };
            }

            // get proof of deposit
            var record = await dbContext.ProofOfDeposits.FirstOrDefaultAsync(pod => pod.Id == details.id);
            if (record is null)
                return new Response { errorMessage = "Not found", data = 404 };

            if (record.Status == (int)Proof_Of_Deposit_Status.APPROVED)
                return new Response { errorMessage = "Cannot edit an approved amount", data = 409 };

            // if rejected, set status to pending and clear rejection message
            if (record.Status == (int)Proof_Of_Deposit_Status.REJECTED)
            {
                record.Status = (int)Proof_Of_Deposit_Status.PENDING;
                record.RejectionMessage = "";
            }

            // check if amount > 0
            if (details.amount is not null && details.amount <= 0)
                return new Response { errorMessage = "Amount must be greater than 0", data = 400 };

            // add to files to delete table if the file path was edited
            if (details.filePath is not null)
            {
                var result = await filesToDeleteService.AddMany(new List<AddFileToDelete>(){
                    new AddFileToDelete(){
                        filePath=record.FilePath,
                        fileName=record.FileName
                    }
                });
                if (result.errorMessage != "")
                    return result;
            }

            record.Amount = details.amount ?? record.Amount;
            record.FilePath = details.filePath ?? record.FilePath;
            record.FileName = details.fileName ?? record.FileName;

            dbContext.ProofOfDeposits.Update(record);
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    /*----   GET PENDING PROOF OF DEPOSITS   ----*/
    public async Task<Response> getPendingProofOfDeposits()
    {
        try
        {
            var records = await dbContext.ProofOfDeposits.Where(pod => pod.Status == (int)Proof_Of_Deposit_Status.PENDING).ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }




    /*----   EDIT PROOF OF DEPOSIT STATUS   ----*/
    public async Task<Response> EditProofOfDepositStatus(EditProofOfDepositStatus details, string message)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "Empty values", data = 400 };
            }

            // get proof of deposit
            var record = await dbContext.ProofOfDeposits.FirstOrDefaultAsync(pod => pod.Id == details.id);
            if (record is null)
                return new Response { errorMessage = "Not found", data = 404 };

            switch (details.status)
            {
                case (int)Proof_Of_Deposit_Status.APPROVED:
                    if (record.Status == (int)Proof_Of_Deposit_Status.REJECTED)
                        return new Response { errorMessage = "Cannot approve a rejected request", data = 409 };
                    if (record.Status == (int)Proof_Of_Deposit_Status.APPROVED)
                        return new Response { errorMessage = "Request already approved", data = 409 };
                    break;
                case (int)Proof_Of_Deposit_Status.REJECTED:
                    if (message.Length == 0)
                        return new Response { errorMessage = "No rejection message provided", data = 400 };

                    if (record.Status == (int)Proof_Of_Deposit_Status.REJECTED)
                        return new Response { errorMessage = "Request already rejected", data = 409 };
                    if (record.Status == (int)Proof_Of_Deposit_Status.APPROVED)
                        return new Response { errorMessage = "Cannot reject an approved request", data = 409 };

                    record.RejectionMessage = message;
                    break;

                default:
                    return new Response { errorMessage = "Invalid status", data = 400 };
            }

            record.Status = (int)details.status;

            // add statement item if status is now approved
            if (record.Status == (int)Proof_Of_Deposit_Status.APPROVED)
            {
                var result = await this.AddStatementItem(new AddStatementItem()
                {
                    parentId = record.ParentId,
                    itemType = (int)Statement_Item_Type.DEPOSIT,
                    creditAmount = record.Amount,
                    debitAmount = 0,
                    description = "Deposit made and approved"
                });

                if (result.errorMessage != "")
                    return result;
            }

            dbContext.ProofOfDeposits.Update(record);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    /*----   DELETE PROOF OF DEPOSIT   ----*/
    public async Task<Response> DeleteProofOfDeposit(int id)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // get record
            var record = await dbContext.ProofOfDeposits.FirstOrDefaultAsync(pod => pod.Id == id);
            if (record is null)
                return new Response { errorMessage = "Not found", data = 404 };

            // return if already approved
            if (record.Status == (int)Proof_Of_Deposit_Status.APPROVED)
                return new Response { errorMessage = "Cannot delete an approved proof of deposit", data = 409 };

            // add to files to delete table
            var result = await filesToDeleteService.AddMany(new List<AddFileToDelete>(){
                new AddFileToDelete(){
                    filePath=record.FilePath,
                    fileName=record.FileName
                }
            });
            if (result.errorMessage != "")
                return result;

            // delete
            dbContext.ProofOfDeposits.Remove(record);
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    #endregion

    #region Charging fees 

    /*----   CHARGE ALL PARENTS MONTHLY FEES   ----*/
    public async Task<Response> ChargeAllParentsMonthlyFees()
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var feesForGrades = await dbContext.FeesForGrades.ToListAsync();

            var parents = await dbContext.Parents.ToListAsync();

            for (int i = 0; i < parents.Count; i++)
            {
                var parent = parents[i];

                var statement = await dbContext.ParentFinancialStatements.FirstOrDefaultAsync(pfs => pfs.ParentId == parent.UserId);
                if (statement is null)
                    continue;

                var statementItemCount = await dbContext.StatementItems.CountAsync();

                var students = await dbContext.Students.Where(student => student.ParentId == parent.UserId).ToListAsync();

                decimal fees = 0;
                for (int j = 0; j < students.Count; j++)
                {
                    var student = students[j];

                    var fee = feesForGrades.FirstOrDefault(f => f.Grade == student.Grade);
                    if (fee is null)
                    {
                        logger.LogError("Record for fee not found.");
                        continue;
                    }

                    fees += fee.Amount;
                }

                if (fees > 0)
                {
                    var result = await this.AddStatementItem(new AddStatementItem()
                    {
                        parentId = parent.UserId,
                        itemType = (int)Statement_Item_Type.FEE,
                        description = "Monthly school fee charge",
                        creditAmount = 0,
                        debitAmount = fees
                    });

                    if (result.errorMessage != "")
                    {
                        logger.LogError(result.errorMessage);
                        continue;
                    }
                }
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = ex.Message, data = 500 };
        }
    }



    #endregion
}

