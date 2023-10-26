using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Helpers;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class RegistrationService
{
    private readonly SCA_ITSContext dbContext;
    private FilesToDeleteService filesToDeleteService;
    private FinancialStatementService financialStatementService;
    private IS3Service s3Service;
    private StudentReportService studentReportService;
    private MoodleService moodleService;
    private PrePrimaryProgressReportsService prePrimaryProgressReportsService;

    public RegistrationService(SCA_ITSContext dbContext, FilesToDeleteService filesToDeleteService, IS3Service s3Service, FinancialStatementService financialStatementService, StudentReportService studentReportService, MoodleService moodleService, PrePrimaryProgressReportsService prePrimaryProgressReportsService)
    {
        this.dbContext = dbContext;
        this.filesToDeleteService = filesToDeleteService;
        this.s3Service = s3Service;
        this.financialStatementService = financialStatementService;
        this.studentReportService = studentReportService;
        this.moodleService = moodleService;
        this.prePrimaryProgressReportsService = prePrimaryProgressReportsService;
    }

    /*----   APPROVE PARENT   ----*/
    public async Task<Response> ApproveParent(ApproveRejectParentRegistrationRequest details)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (details.userId == null)
                return new Response { errorMessage = "empty values", data = 400 };

            // update parent account to approved
            // TODO: remove
            var parent = await dbContext.UserAccounts.Where(p => p.UserId == details.userId && p.UserTypeId == 2).FirstOrDefaultAsync();
            if (parent is null)
            {
                return new Response { errorMessage = "parent not found", data = 404 };
            }
            parent.IsApproved = 1;
            dbContext.UserAccounts.Update(parent);
            await dbContext.SaveChangesAsync();
            //-----------------------------------

            // update profile to approved
            var parentProfile = await dbContext.Parents.Where(p => p.UserId == details.userId).FirstAsync();
            parentProfile.RegistrationStage = (int)PARENT_REGISTRATION_STATUS.APPROVED;

            dbContext.Parents.Update(parentProfile);
            await dbContext.SaveChangesAsync();
            //-----------------------------------


            // create parent financial statement
            var result = await financialStatementService.AddStatementForParent(parent.UserId);
            if (result.errorMessage != "")
            {
                // if the record already exists, continue as normal.  NB! This is mostly for the test cases to pass
                if (result.data != 409)
                    throw new Exception(result.errorMessage);
            }
            //-----------------------------------

            // prevent approval if parent does not have any students being registered
            decimal numOfStudents = await dbContext.Students.Where(s => s.ParentId == parent.UserId).CountAsync();
            if (numOfStudents == 0)
            {
                return new Response { errorMessage = "Parent must have at least one student being registered", data = 409 };
            }

            // calculate registration fee amount per student
            // decimal registrationFee = 3850;
            // decimal total = numOfStudents * registrationFee;

            // debit parent statement by registration fee amount
            result = await financialStatementService.AddStatementItem(new AddStatementItem
            {
                parentId = parent.UserId,
                itemType = (int)Statement_Item_Type.REGISTRATION,
                description = "Registration fee",
                debitAmount = 3850,     // temp until its decided if fees are per child or a fixed amount
                creditAmount = 0,
            });
            if (result.errorMessage != "")
                return result;

            // credit parent statement by registration fee amount
            result = await financialStatementService.AddStatementItem(new AddStatementItem
            {
                parentId = parent.UserId,
                itemType = (int)Statement_Item_Type.DEPOSIT,
                description = "Registration fee paid",
                debitAmount = 0,     // temp until its decided if fees are per child or a fixed amount
                creditAmount = 3850,
            });
            if (result.errorMessage != "")
                return result;

            //--------------------------------------------------


            // approve all students not rejected
            var students = await dbContext.Students.Where(s => s.ParentId == details.userId && s.RegistrationStage != (int)STUDENT_REGISTRATION_STATUS.REJECTED).ToListAsync();
            foreach (var student in students)
            {
                result = await ApproveStudent(new ApproveRejectStudentRegistrationRequest
                {
                    studentNumber = student.StudentNumber
                });
                if (result.errorMessage != "")
                    return new Response { errorMessage = "Failed to approve one of the students: " + result.errorMessage, data = result.data };
            }
            //--------------------------------------------------



            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----  APPROVE STUDENT   ----*/
    public async Task<Response> ApproveStudent(ApproveRejectStudentRegistrationRequest details)
    {
        try
        {
            if (details.studentNumber == null || details.studentNumber == "")
            {
                return new Response { errorMessage = "empty values", data = 400 };
            }

            // get student 
            var student = await dbContext.Students.Where(s => s.StudentNumber == details.studentNumber).FirstOrDefaultAsync();
            if (student is null)
                return new Response { errorMessage = "student not found", data = 404 };

            var prevStage = student.RegistrationStage;

            // update student
            student.RegistrationStage = (int)STUDENT_REGISTRATION_STATUS.APPROVED;

            dbContext.Students.Update(student);
            await dbContext.SaveChangesAsync();


            /* 
                if the parent is not approved, it means this is part of the application process and the 
                student will be approved again once the parent is approved. 
                So we dont create any additional records/

                if the parent is approved, create the additional records.

                If the student is already approved, dont recreate the records.
            */


            var parent = await dbContext.UserAccounts.FirstAsync(p => p.UserId == student.ParentId);
            var parentProfile = await dbContext.Parents.FirstAsync(p => p.UserId == student.ParentId);

            if (parentProfile.RegistrationStage == (int)PARENT_REGISTRATION_STATUS.APPROVED && prevStage != (int)PARENT_REGISTRATION_STATUS.APPROVED)
            {
                // create report for student 
                var result = (student.Grade > 0) ? await studentReportService.CreateReportForPrimaryStudentForLatestReportGroup(student) : await studentReportService.CreateReportForPrePrimaryStudentForLatestReportGroup(student);

                if (result.errorMessage.Length > 0)
                {
                    student.RegistrationStage = prevStage;

                    dbContext.Students.Update(student);
                    await dbContext.SaveChangesAsync();
                    throw new Exception("Failed to create report record for student");
                }

                if (student.Grade == 0)
                {
                    result = await prePrimaryProgressReportsService.AddAllPrePrimaryProgressReportsForStudent(student.StudentNumber);
                    if (!string.IsNullOrEmpty(result.errorMessage))
                    {
                        student.RegistrationStage = prevStage;

                        dbContext.Students.Update(student);
                        await dbContext.SaveChangesAsync();
                        throw new Exception("Failed to create progress reports: " + result.errorMessage);
                    }
                }

                // create moodle user for student
                var addMoodleUserReq = new MoodleAddUserRequest()
                {
                    username = student.StudentNumber,
                    firstname = student.FirstName,
                    lastname = student.LastName,
                    email = parent.Email,
                    password = $"{student.StudentNumber}@Sca"
                };
                result = await moodleService.AddUser(addMoodleUserReq);
                if (result.errorMessage.Length > 0)
                {
                    student.RegistrationStage = prevStage;

                    dbContext.Students.Update(student);
                    await dbContext.SaveChangesAsync();
                    throw new Exception("Failed to create moodle user: " + result.errorMessage);
                }
            }


            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = ex.Message, data = 500 };
        }
    }


    /*----   GET PARENTS REGISTERING OR WITH REGISTERING STUDENTS   ----*/
    public async Task<Response> GetParentsRegisteringOrWithRegisteringStudents()
    {
        try
        {
            var records = await (
                from u in dbContext.UserAccounts
                join p in dbContext.Parents on u.UserId equals p.UserId
                where p.RegistrationStage != (int)PARENT_REGISTRATION_STATUS.APPROVED || dbContext.Students.Where(s => s.RegistrationStage != (int)STUDENT_REGISTRATION_STATUS.APPROVED && s.ParentId == u.UserId).Count() > 0
                select new
                {
                    u.UserId,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    p.RegistrationStage,
                    CreatedAt = u.CreatedAt.ToString()
                }
            ).ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }



    /*----   ADD STUDENT REGISTRATION FILE   ----*/
    public async Task<Response> AddStudentRegistrationFile(AddStudentRegistrationFileRequest details)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "empty values", data = 400 };

            var student = await dbContext.Students.Where(s => s.StudentNumber == details.studentNumber).FirstOrDefaultAsync();
            if (student is null)
                return new Response { errorMessage = "student not found", data = 404 };

            // check if file exists
            if (await dbContext.StudentRegistrationFiles.AnyAsync(f => f.FilePath.Equals(details.filePath)))
                return new Response { errorMessage = "File already exists", data = 409 };

            // check if required document exists
            if (!(await dbContext.RequiredRegistrationDocuments.AnyAsync(r => r.Id == details.requiredId)))
                return new Response { errorMessage = "Required document not found", data = 404 };

            // add file
            StudentRegistrationFile file = new StudentRegistrationFile()
            {
                StudentNumber = details.studentNumber,
                FilePath = details.filePath,
                RequiredId = details.requiredId,
                Name = details.name
            };
            await dbContext.StudentRegistrationFiles.AddAsync(file);
            await dbContext.SaveChangesAsync();

            // check if all registration files added
            var reqDocs = await dbContext.RequiredRegistrationDocuments.Where(r => r.UserTypeId == 4).ToListAsync();
            var allFilesAdded = true;
            foreach (var item in reqDocs)
            {
                if (!await dbContext.StudentRegistrationFiles.AnyAsync(f => f.RequiredId == item.Id))
                {
                    allFilesAdded = false;
                    break;
                }
            }

            if (allFilesAdded)
            {
                var result = await EditStudentRegistrationStatus(new EditStudentRegistrationStatus
                {
                    studentNumber = student.StudentNumber,
                    requiredDocsAdded = 1,
                    requiredDocsRejectionMessage = ""
                });
                if (result.errorMessage != "")
                    return result;
            }
            else
            {
                var result = await EditStudentRegistrationStatus(new EditStudentRegistrationStatus
                {
                    studentNumber = student.StudentNumber,
                    requiredDocsRejectionMessage = ""
                });
                if (result.errorMessage != "")
                    return result;
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----   DELETE STUDENT REGISTRATION FILE   ----*/
    public async Task<Response> DeleteStudentRegistrationFile(DeleteFileRequest details)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "empty values", data = 400 };

            // get file
            var file = await dbContext.StudentRegistrationFiles.Where(f => f.FilePath == details.filePath).FirstOrDefaultAsync();
            if (file is null)
                return new Response { errorMessage = "file not found", data = 404 };

            // delete file from s3
            var deletedFromS3 = await s3Service.deleteObject(file.FilePath);
            if (!deletedFromS3)
                return new Response { errorMessage = "Failed to delete file, try again later", data = 500 };

            // delete file from db
            dbContext.StudentRegistrationFiles.Remove(file);
            await dbContext.SaveChangesAsync();

            // check if all registration files added
            var reqDocs = await dbContext.RequiredRegistrationDocuments.Where(r => r.UserTypeId == 4).ToListAsync();
            var allFilesAdded = true;
            foreach (var item in reqDocs)
            {
                if (!await dbContext.StudentRegistrationFiles.AnyAsync(f => f.RequiredId == item.Id))
                {
                    allFilesAdded = false;
                    break;
                }
            }

            if (!allFilesAdded)
            {
                var result = await EditStudentRegistrationStatus(new EditStudentRegistrationStatus
                {
                    studentNumber = file.StudentNumber,
                    requiredDocsAdded = 0
                });
                if (result.errorMessage != "")
                    return result;
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----   ADD PARENT REGISTRATION FILE   ----*/
    public async Task<Response> AddParentRegistrationFile(AddParentRegistrationFileRequest details)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "empty values", data = 400 };

            var parent = await dbContext.Parents.Where(p => p.UserId == details.userId).FirstOrDefaultAsync();
            if (parent is null)
                return new Response { errorMessage = "parent not found", data = 404 };

            // check if file exists
            if (await dbContext.ParentRegistrationFiles.AnyAsync(f => f.FilePath.Equals(details.filePath)))
                return new Response { errorMessage = "File already exists", data = 409 };

            // check if required document exists
            if (!(await dbContext.RequiredRegistrationDocuments.AnyAsync(r => r.Id == details.requiredId)))
                return new Response { errorMessage = "Required document not found", data = 404 };

            // add file
            ParentRegistrationFile file = new ParentRegistrationFile()
            {
                UserId = details.userId,
                FilePath = details.filePath,
                RequiredId = details.requiredId,
                Name = details.name
            };
            await dbContext.ParentRegistrationFiles.AddAsync(file);
            await dbContext.SaveChangesAsync();

            // check if all registration files added
            var reqDocs = await dbContext.RequiredRegistrationDocuments.Where(r => r.UserTypeId == 2).ToListAsync();
            var allFilesAdded = true;
            foreach (var item in reqDocs)
            {
                if (!await dbContext.ParentRegistrationFiles.AnyAsync(f => f.RequiredId == item.Id))
                {
                    allFilesAdded = false;
                    break;
                }
            }

            if (allFilesAdded)
            {
                var result = await EditParentRegistrationStatus(new EditParentRegistrationStatus
                {
                    parentId = details.userId,
                    requiredDocsAdded = 1,
                    requiredDocsRejectionMessage = ""
                });
                if (result.errorMessage != "")
                    return result;
            }
            else
            {
                var result = await EditParentRegistrationStatus(new EditParentRegistrationStatus
                {
                    parentId = details.userId,
                    requiredDocsRejectionMessage = ""
                });
                if (result.errorMessage != "")
                    return result;
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----   DELETE PARENT REGISTRATION FILE   ----*/
    public async Task<Response> DeleteParentRegistrationFile(DeleteFileRequest details)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "empty values", data = 400 };

            // get file
            var file = await dbContext.ParentRegistrationFiles.Where(f => f.FilePath == details.filePath).FirstOrDefaultAsync();
            if (file is null)
                return new Response { errorMessage = "file not found", data = 404 };

            // delete file from s3
            var deletedFromS3 = await s3Service.deleteObject(file.FilePath);
            if (!deletedFromS3)
                return new Response { errorMessage = "Failed to delete file, try again later", data = 500 };

            // delete file from db
            dbContext.ParentRegistrationFiles.Remove(file);
            await dbContext.SaveChangesAsync();

            // check if all registration files added
            var reqDocs = await dbContext.RequiredRegistrationDocuments.Where(r => r.UserTypeId == 2).ToListAsync();
            var allFilesAdded = true;
            foreach (var item in reqDocs)
            {
                if (!await dbContext.ParentRegistrationFiles.AnyAsync(f => f.RequiredId == item.Id))
                {
                    allFilesAdded = false;
                    break;
                }
            }

            if (!allFilesAdded)
            {
                var result = await EditParentRegistrationStatus(new EditParentRegistrationStatus
                {
                    parentId = file.UserId,
                    requiredDocsAdded = 0
                });
                if (result.errorMessage != "")
                    return result;
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }


    /*----   GET PARENT REGISTRATION FEE FILES   ----*/
    public async Task<Response> GetParentRegistrationFeeFiles(int parentId)
    {
        try
        {
            var records = await dbContext.ParentRegistrationPaymentFiles.Where(p => p.ParentId == parentId).ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }


    /*----   ADD PARENT REGISTRATION FEE FILE   ----*/
    public async Task<Response> AddParentRegistrationFeeFile(AddParentRegistrationFeeFile details)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "empty values", data = 400 };

            var parent = await dbContext.Parents.Where(p => p.UserId == details.parentId).FirstOrDefaultAsync();
            if (parent is null)
                return new Response { errorMessage = "parent not found", data = 404 };

            // check if file exists
            if (await dbContext.ParentRegistrationPaymentFiles.AnyAsync(f => f.FilePath.Equals(details.filePath)))
                return new Response { errorMessage = "File already exists", data = 409 };

            // add file
            ParentRegistrationPaymentFile file = new ParentRegistrationPaymentFile()
            {
                ParentId = (int)details.parentId,
                FilePath = details.filePath,
                FileName = details.fileName
            };
            await dbContext.ParentRegistrationPaymentFiles.AddAsync(file);
            await dbContext.SaveChangesAsync();

            var result = await EditParentRegistrationStatus(new EditParentRegistrationStatus
            {
                parentId = parent.UserId,
                registrationFeePaid = 1,
                registrationFeeRejectionMessage = ""
            });
            if (result.errorMessage != "")
                return result;

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----   DELETE PARENT REGISTRATION FEE FILE   ----*/
    public async Task<Response> DeleteParentRegistrationFeeFile(string filePath)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // get file
            var file = await dbContext.ParentRegistrationPaymentFiles.Where(f => f.FilePath == filePath).FirstOrDefaultAsync();
            if (file is null)
                return new Response { errorMessage = "file not found", data = 404 };

            // delete file from s3
            var deletedFromS3 = await s3Service.deleteObject(file.FilePath);
            if (!deletedFromS3)
                return new Response { errorMessage = "Failed to delete file, try again later", data = 500 };

            // delete file from db
            dbContext.ParentRegistrationPaymentFiles.Remove(file);
            await dbContext.SaveChangesAsync();


            if ((await dbContext.ParentRegistrationPaymentFiles.Where(f => f.ParentId == file.ParentId).CountAsync()) == 0)
            {
                var result = await EditParentRegistrationStatus(new EditParentRegistrationStatus
                {
                    parentId = file.ParentId,
                    registrationFeePaid = 0,
                });
                if (result.errorMessage != "")
                    return result;
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }




    /*----  DELETE REQUIRED REGISTRATION DOCUMENT   ----*/
    public async Task<Response> DeleteRequiredRegistrationDocument(int id)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // get record
            var requiredDoc = await dbContext.RequiredRegistrationDocuments.Where(doc => doc.Id == id).FirstOrDefaultAsync();
            if (requiredDoc is null)
            {
                return new Response { errorMessage = "Record not found", data = 404 };
            }

            // get files
            var files = await dbContext.ParentRegistrationFiles.Where(file => file.RequiredId == id)
            .Select(file => new AddFileToDelete()
            {
                filePath = file.FilePath,
                fileName = file.Name
            })
            .ToListAsync();
            files.AddRange(
                await dbContext.StudentRegistrationFiles.Where(file => file.RequiredId == id)
                .Select(file => new AddFileToDelete()
                {
                    filePath = file.FilePath,
                    fileName = file.Name
                })
                .ToListAsync()
            );

            // add to files to delete table
            var result = await filesToDeleteService.AddMany(files);
            if (result.errorMessage != "")
                return result;

            // delete 
            dbContext.RequiredRegistrationDocuments.Remove(requiredDoc);
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----    REJECT PARENT REGISTRATION    ----*/
    public async Task<Response> RejectParentRegistration(ApproveRejectParentRegistrationRequest details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            var parent = await dbContext.UserAccounts.Where(p => p.UserId == details.userId && p.UserTypeId == 2).FirstOrDefaultAsync();
            var profile = await dbContext.Parents.Where(p => p.UserId == details.userId).FirstOrDefaultAsync();
            if (parent is null || profile is null)
            {
                return new Response { errorMessage = "parent not found", data = 404 };
            }

            parent.IsApproved = 0;

            dbContext.UserAccounts.Update(parent);
            dbContext.Parents.Update(profile);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----    REJECT STUDENT REGISTRATION    ----*/
    public async Task<Response> RejectStudentRegistration(RejectStudentRegistration details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            if (details.registrationStage < 1 || details.registrationStage > 12)
                return new Response { errorMessage = "Invalid registration status provided", data = 400 };

            var student = await dbContext.Students.Where(s => s.StudentNumber == details.studentNumber).FirstOrDefaultAsync();
            if (student is null)
                return new Response { errorMessage = "student not found", data = 404 };


            student.RegistrationStage = (int)details.registrationStage;
            student.RejectionMessage = details.reason;

            dbContext.Students.Update(student);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----   GET STUDENT REGISTRATION STATUS   ----*/
    public async Task<Response> GetStudentRegistrationStatus(string studentNumber)
    {
        try
        {
            var record = await dbContext.StudentRegistrationStatuses.Where(s => s.StudentNumber == studentNumber).FirstOrDefaultAsync();
            if (record is null)
                return new Response { errorMessage = "student not found", data = 404 };

            return new Response { errorMessage = "", data = record };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----   ADD STUDENT REGISTRATION STATUS RECORD   ----*/
    public async Task<Response> AddStudentRegistrationStatusRecord(string studentNumber)
    {
        try
        {
            var student = await dbContext.Students.Where(s => s.StudentNumber == studentNumber).FirstOrDefaultAsync();
            if (student is null)
                return new Response { errorMessage = "student not found", data = 404 };

            StudentRegistrationStatus record = new StudentRegistrationStatus
            {
                StudentNumber = studentNumber,
                BasicDetailsAdded = 1,
                GeneralInfoAdded = 0,
                ReligiousInfoAdded = 0,
                ScholasticInfoAdded = 0,
                MedicalInfoAdded = 0,
                MedicalConditionsAdded = 0,
                OtherParentsAdded = 0,
                NonScaStudentsAdded = 0,
                RequiredDocsAdded = 0,
                OccupationalTherapyNeeded = (ulong)(student.Grade <= 1 ? 1 : 0),
                OccupationalReportAdded = 0,
                DiagnosticTestNeeded = 0,
                DiagnosticResultAdded = 0,
            };

            await dbContext.StudentRegistrationStatuses.AddAsync(record);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----    EDIT STUDENT REGISTRATION STATUS    ----*/
    public async Task<Response> EditStudentRegistrationStatus(EditStudentRegistrationStatus details)
    {
        try
        {
            if (details.studentNumber is null)
                return new Response { errorMessage = "Empty values", data = 400 };

            var record = await dbContext.StudentRegistrationStatuses.Where(s => s.StudentNumber == details.studentNumber).FirstOrDefaultAsync();
            if (record is null)
                return new Response { errorMessage = "student not found", data = 404 };

            record.BasicDetailsAdded = details.basicDetailsAdded ?? record.BasicDetailsAdded;
            record.GeneralInfoAdded = details.generalInfoAdded ?? record.GeneralInfoAdded;
            record.ReligiousInfoAdded = details.religiousInfoAdded ?? record.ReligiousInfoAdded;
            record.ScholasticInfoAdded = details.scholasticInfoAdded ?? record.ScholasticInfoAdded;
            record.MedicalInfoAdded = details.medicalInfoAdded ?? record.MedicalInfoAdded;
            record.MedicalConditionsAdded = details.medicalConditionsAdded ?? record.MedicalConditionsAdded;
            record.OtherParentsAdded = details.otherParentsAdded ?? record.OtherParentsAdded;
            record.NonScaStudentsAdded = details.nonScaStudentsAdded ?? record.NonScaStudentsAdded;
            record.RequiredDocsAdded = details.requiredDocsAdded ?? record.RequiredDocsAdded;
            record.OccupationalTherapyNeeded = details.occupationalTherapyNeeded ?? record.OccupationalTherapyNeeded;
            record.OccupationalReportAdded = details.occupationalReportAdded ?? record.OccupationalReportAdded;
            record.DiagnosticTestNeeded = details.diagnosticTestNeeded ?? record.DiagnosticTestNeeded;
            record.DiagnosticResultAdded = details.diagnosticResultAdded ?? record.DiagnosticResultAdded;

            record.TherapistName = details.therapistName ?? record.TherapistName;
            record.TherapistCell = details.therapistCell ?? record.TherapistCell;
            record.TherapistEmail = details.therapistEmail ?? record.TherapistEmail;
            record.TherapistUrl = details.therapistUrl ?? record.TherapistUrl;

            record.DiagnosticTestLink = details.diagnosticTestLink ?? record.DiagnosticTestLink;

            record.BasicRejectionMessage = details.basicRejectionMessage ?? record.BasicRejectionMessage;
            record.GeneralRejectionMessage = details.generalRejectionMessage ?? record.GeneralRejectionMessage;
            record.ReligiousRejectionMessage = details.religiousRejectionMessage ?? record.ReligiousRejectionMessage;
            record.ScholasticRejectionMessage = details.scholasticRejectionMessage ?? record.ScholasticRejectionMessage;
            record.MedicalRejectionMessage = details.medicalRejectionMessage ?? record.MedicalRejectionMessage;
            record.ConditionsRejectionMessage = details.conditionsRejectionMessage ?? record.ConditionsRejectionMessage;
            record.OtherParentsRejectionMessage = details.otherParentsRejectionMessage ?? record.OtherParentsRejectionMessage;
            record.NonScaRejectionMessage = details.nonScaRejectionMessage ?? record.NonScaRejectionMessage;
            record.RequiredDocsRejectionMessage = details.requiredDocsRejectionMessage ?? record.RequiredDocsRejectionMessage;
            record.TherapyRejectionMessage = details.therapyRejectionMessage ?? record.TherapyRejectionMessage;
            record.DiagnosticRejectionMessage = details.diagnosticRejectionMessage ?? record.DiagnosticRejectionMessage;

            dbContext.StudentRegistrationStatuses.Update(record);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----   GET PARENT REGISTRATION STATUS   ----*/
    public async Task<Response> GetParentRegistrationStatus(int parentId)
    {
        try
        {
            var record = await dbContext.ParentRegistrationStatuses.Where(s => s.ParentId == parentId).FirstOrDefaultAsync();
            if (record is null)
                return new Response { errorMessage = "parent not found", data = 404 };

            return new Response { errorMessage = "", data = record };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }



    /*----    EDIT PARENT REGISTRATION STATUS    ----*/
    public async Task<Response> EditParentRegistrationStatus(EditParentRegistrationStatus details)
    {
        try
        {
            if (details.parentId is null)
                return new Response { errorMessage = "Empty values", data = 400 };

            var record = await dbContext.ParentRegistrationStatuses.Where(p => p.ParentId == details.parentId).FirstOrDefaultAsync();
            if (record is null)
                return new Response { errorMessage = "Parent not found", data = 404 };

            record.DetailsAdded = details.detailsAdded ?? record.DetailsAdded;
            record.OtherParentsAdded = details.otherParentsAdded ?? record.OtherParentsAdded;
            record.StudentsAdded = details.studentsAdded ?? record.StudentsAdded;
            record.RequiredDocsAdded = details.requiredDocsAdded ?? record.RequiredDocsAdded;
            record.DetailsRejectionMessage = details.detailsRejectionMessage ?? record.DetailsRejectionMessage;
            record.OtherParentsRejectionMessage = details.otherParentsRejectionMessage ?? record.OtherParentsRejectionMessage;
            record.StudentsRejectionMessage = details.studentsRejectionMessage ?? record.StudentsRejectionMessage;
            record.RequiredDocsRejectionMessage = details.requiredDocsRejectionMessage ?? record.RequiredDocsRejectionMessage;
            record.RegistrationFeePaid = details.registrationFeePaid ?? record.RegistrationFeePaid;
            record.RegistrationFeeRejectionMessage = details.registrationFeeRejectionMessage ?? record.RegistrationFeeRejectionMessage;

            dbContext.ParentRegistrationStatuses.Update(record);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }



    /*----   GET THERAPY REPORTS   ----*/
    public async Task<Response> GetTherapyReports(string studentNumber)
    {
        try
        {
            var records = await dbContext.StudentOccupationalTherapyFiles.Where(s => s.StudentNumber == studentNumber).ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----   ADD THERAPY REPORT   ----*/
    public async Task<Response> AddTherapyReport(AddStudentTherapyFile details)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "empty values", data = 400 };

            var student = await dbContext.Students.Where(s => s.StudentNumber == details.studentNumber).FirstOrDefaultAsync();
            if (student is null)
                return new Response { errorMessage = "student not found", data = 404 };

            StudentOccupationalTherapyFile record = new StudentOccupationalTherapyFile
            {
                StudentNumber = details.studentNumber,
                FilePath = details.filePath,
                FileName = details.fileName
            };

            await dbContext.StudentOccupationalTherapyFiles.AddAsync(record);
            await dbContext.SaveChangesAsync();

            // update reg status
            var result = await EditStudentRegistrationStatus(new EditStudentRegistrationStatus
            {
                studentNumber = student.StudentNumber,
                occupationalReportAdded = 1,
                therapyRejectionMessage = ""
            });
            if (result.errorMessage != "")
                return result;

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----   DELETE THERAPY REPORT   ----*/
    public async Task<Response> DeleteTherapyReport(string filePath)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var record = await dbContext.StudentOccupationalTherapyFiles.Where(s => s.FilePath == filePath).FirstOrDefaultAsync();
            if (record is null)
                return new Response { errorMessage = "file not found", data = 404 };

            var result = await filesToDeleteService.AddMany(new List<AddFileToDelete>(){
                new AddFileToDelete{
                    filePath=record.FilePath,
                    fileName=record.FileName
            }});
            if (result.errorMessage != "")
                return result;

            dbContext.StudentOccupationalTherapyFiles.Remove(record);
            await dbContext.SaveChangesAsync();

            if (await dbContext.StudentOccupationalTherapyFiles.CountAsync() == 0)
            {
                result = await EditStudentRegistrationStatus(new EditStudentRegistrationStatus
                {
                    studentNumber = record.StudentNumber,
                    occupationalReportAdded = 0
                });
                if (result.errorMessage != "")
                    return result;
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

}