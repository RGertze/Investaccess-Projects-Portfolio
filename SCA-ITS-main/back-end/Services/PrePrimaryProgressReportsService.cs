using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class PrePrimaryProgressReportsService
{
    private readonly SCA_ITSContext dbContext;

    public PrePrimaryProgressReportsService(SCA_ITSContext dbContext)
    {
        this.dbContext = dbContext;
    }

    #region Get

    /*----   GET ALL PRE PRIMARY PROGRESS REPORTS   ----*/
    /// <summary>
    ///     Gets all pre-primary progress reports
    /// </summary>
    /// <returns></returns>
    public async Task<Response> GetAllPrePrimaryProgressReports()
    {
        try
        {
            var records = await dbContext.PrePrimaryProgressReports.ToListAsync();

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

    /*----   GET STUDENT PRE PRIMARY PROGRESS REPORTS BY PROGRESS REPORT   ----*/
    /// <summary>
    ///     Gets all student pre-primary progress reports
    /// </summary>
    /// <param name="progressReportId">id of progress report for which to get student records</param>
    /// <returns></returns>
    public async Task<Response> GetStudentPrePrimaryProgressReportsByProgressReport(int progressReportId)
    {
        try
        {
            var records = await (
                from sp in dbContext.StudentPrePrimaryProgressReports
                join student in dbContext.Students on sp.StudentNumber equals student.StudentNumber
                join p in dbContext.PrePrimaryProgressReports on sp.ProgressReportId equals p.Id
                where p.Id == progressReportId
                select new
                {
                    sp.Id,
                    sp.ProgressReportId,
                    p.Year,
                    p.Terms,

                    student.StudentNumber,
                    student.FirstName,
                    student.LastName,
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

    /*----   GET STUDENT PRE PRIMARY PROGRESS REPORTS   ----*/
    /// <summary>
    ///     Gets student pre-primary progress reports
    /// </summary>
    /// <returns></returns>
    public async Task<Response> GetStudentPrePrimaryProgressReports(string studentNumber)
    {
        try
        {
            var records = await (
                from sp in dbContext.StudentPrePrimaryProgressReports
                join p in dbContext.PrePrimaryProgressReports on sp.ProgressReportId equals p.Id
                where sp.StudentNumber == studentNumber
                select new
                {
                    sp.Id,
                    sp.ProgressReportId,
                    p.Year,
                    p.Terms
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

    /*----   GET STUDENT PRE PRIMARY PROGRESS REPORT   ----*/
    /// <summary>
    ///     Get student pre-primary progress report
    /// </summary>
    /// <returns></returns>
    public async Task<Response> GetStudentPrePrimaryProgressReport(int id)
    {
        try
        {
            var record = await (
                from sp in dbContext.StudentPrePrimaryProgressReports
                join p in dbContext.PrePrimaryProgressReports on sp.ProgressReportId equals p.Id
                where sp.Id == id
                select new
                {
                    sp.Id,
                    sp.ProgressReportId,
                    p.Year,
                    p.Terms
                }
            ).FirstOrDefaultAsync();
            if (record is null)
                return new Response { errorMessage = "record not found", data = 404 };

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

    /*----   GET STUDENT PRE PRIMARY PROGRESS REPORT BY REPORT ID   ----*/
    /// <summary>
    ///     gets a student progress report by taking in a report id and 
    ///     getting the year for which that report was created. It then
    ///     returns the students progress report for that year.
    /// </summary>
    /// <param name="reportId">id</param>
    /// <returns>A Response object indicating success or failure.</returns>
    public async Task<Response> GetStudentPrePrimaryProgressReportByReportId(int reportId)
    {
        try
        {
            var reportGroup = await (
                from rg in dbContext.ReportGroups
                join r in dbContext.Reports on rg.Id equals r.ReportGroupId
                where r.Id == reportId
                select new
                {
                    rg.Year,
                    r.StudentNumber
                }
            ).FirstOrDefaultAsync();
            if (reportGroup is null)
                return new Response { errorMessage = "Report group not found", data = 404 };

            var record = await (
                from sp in dbContext.StudentPrePrimaryProgressReports
                join p in dbContext.PrePrimaryProgressReports on sp.ProgressReportId equals p.Id
                where p.Year == reportGroup.Year && sp.StudentNumber == reportGroup.StudentNumber
                select new
                {
                    sp.Id,
                    sp.ProgressReportId,
                    p.Year,
                    p.Terms
                }
            ).FirstOrDefaultAsync();
            if (record is null)
                return new Response { errorMessage = "progress report not found", data = 404 };

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

    /*----   GET ALL DEVELOPMENT GROUPS   ----*/
    /// <summary>
    ///     Gets all development groups
    /// </summary>
    /// <returns></returns>
    public async Task<Response> GetAllDevelopmentGroups()
    {
        try
        {
            var records = await dbContext.DevelopmentGroups.Select(g => new
            {
                g.Id,
                g.Name,
            }).ToListAsync();

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

    /*----   GET ALL DEVELOPMENT CATEGORIES   ----*/
    /// <summary>
    ///     Gets all development categories
    /// </summary>
    /// <returns></returns>
    public async Task<Response> GetAllDevelopmentCategories()
    {
        try
        {
            var records = await dbContext.DevelopmentCategories.Select(c => new
            {
                c.Id,
                c.GroupId,
                c.Name,
            }).ToListAsync();

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

    /*----   GET ALL DEVELOPMENT ASSESSMENTS   ----*/
    /// <summary>
    ///     Gets all development assessments
    /// </summary>
    /// <returns></returns>
    public async Task<Response> GetAllDevelopmentAssessments()
    {
        try
        {
            var records = await dbContext.DevelopmentAssessments.Select(a => new
            {
                a.Id,
                a.CategoryId,
                a.Name
            }).ToListAsync();

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

    //---   GET DEVELOPMENT ASSESSMENT GRADES FOR PROGRESS REPORT  ---
    /// <summary>
    ///     get development assessment grades for progress report
    /// </summary>
    /// <returns></returns>
    public async Task<Response> GetDevelopmentAssessmentGradesForProgressReport(int studentProgressReportId)
    {
        try
        {
            var records = await (
                from assGrade in dbContext.DevelopmentAssessmentGrades
                join ass in dbContext.DevelopmentAssessments on assGrade.AssessmentId equals ass.Id
                where assGrade.StudentProgressReportId == studentProgressReportId
                select new
                {
                    assGrade.Id,
                    assGrade.AssessmentId,
                    assGrade.Grade,
                    assGrade.Term,
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

    #endregion

    /*----  ADD   ----*/
    /// <summary>
    ///     adds a new pre primary progress report then
    ///     generates student progress reports for pre primary students
    /// </summary>
    /// <param name="details">object containing the year and term of the progress report</param>
    /// <returns>A Response object indicating success or failure.</returns>
    public async Task<Response> Add(AddPrePrimaryProgressReport details)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            if (await dbContext.PrePrimaryProgressReports.AnyAsync(p => p.Year == details.year))
                return new Response { errorMessage = "Progress report for that year already exists", data = 409 };

            var record = new PrePrimaryProgressReport
            {
                Year = (int)details.year,
                Terms = (int)details.terms
            };

            await dbContext.PrePrimaryProgressReports.AddAsync(record);
            await dbContext.SaveChangesAsync();

            var result = await this.AddPrePrimaryProgressReportForStudents(record.Id);
            if (!string.IsNullOrEmpty(result.errorMessage))
                return result;

            await transaction.CommitAsync();

            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----  EDIT   ----*/
    /// <summary>
    ///     edit pre-primary progress report
    /// </summary>
    /// <param name="details">object containing the details of the progress report to edit</param>
    /// <returns>A Response object indicating success or failure.</returns>
    public async Task<Response> Edit(EditPrePrimaryProgressReport details)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            var record = await dbContext.PrePrimaryProgressReports.FirstOrDefaultAsync(p => p.Id == details.id);
            if (record is null)
                return new Response { errorMessage = "Progress report not found", data = 404 };

            if (record.Year != details.year)
            {
                if (await dbContext.PrePrimaryProgressReports.AnyAsync(p => p.Year == details.year))
                    return new Response { errorMessage = "Progress report for that year already exists", data = 409 };
            }

            if (details.terms < 1)
                return new Response { errorMessage = "Terms should atleast be 1", data = 400 };

            if (record.Terms > details.terms)
            {
                var result = await DeleteDevelopmentAssessmentGradesByTerm(record.Id, (int)details.terms);
                if (!string.IsNullOrEmpty(result.errorMessage))
                    return result;
            }
            if (record.Terms < details.terms)
            {
                var result = await AddDevelopmentAssessmentGradesByTerm(record.Id, (int)details.terms);
                if (!string.IsNullOrEmpty(result.errorMessage))
                    return result;
            }

            record.Terms = (int)details.terms;
            record.Year = (int)details.year;

            dbContext.PrePrimaryProgressReports.Update(record);
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = "ok" };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----  ADD PRE PRIMARY PROGRESS REPORT FOR STUDENTS   ----*/
    /// <summary>
    ///     Create a progress report record for each pre primary student.
    /// </summary>
    /// <param name="progressReportId">The id of the progress report to be used to create the student records</param>
    /// <returns>A Response object indicating success or failure.</returns>
    private async Task<Response> AddPrePrimaryProgressReportForStudents(int progressReportId)
    {
        try
        {
            var prePrimaryProgressReport = await dbContext.PrePrimaryProgressReports.FirstOrDefaultAsync(p => p.Id == progressReportId);
            if (prePrimaryProgressReport is null)
                return new Response { errorMessage = "Progress report does not exist", data = 404 };

            var students = await dbContext.Students.Where(s => s.Grade == 0).ToListAsync();

            var records = new List<StudentPrePrimaryProgressReport>();
            foreach (var student in students)
            {
                var record = new StudentPrePrimaryProgressReport
                {
                    ProgressReportId = progressReportId,
                    StudentNumber = student.StudentNumber
                };

                records.Add(record);
            }

            await dbContext.StudentPrePrimaryProgressReports.AddRangeAsync(records);
            await dbContext.SaveChangesAsync();

            var result = await createDevelopmentAssessmentGradeRecords(records, prePrimaryProgressReport.Terms);
            if (string.IsNullOrEmpty(result.errorMessage))
                return result;

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----  ADD ALL PRE PRIMARY PROGRESS REPORTS FOR STUDENT   ----*/
    /// <summary>
    ///     Create a progress report records for pre primary student.
    /// </summary>
    /// <param name="studentNumber">the student for which to add records</param>
    /// <returns>A Response object indicating success or failure.</returns>
    public async Task<Response> AddAllPrePrimaryProgressReportsForStudent(string studentNumber)
    {
        try
        {
            var preProgressReports = await dbContext.PrePrimaryProgressReports.ToListAsync();

            foreach (var progRep in preProgressReports)
            {
                var record = new StudentPrePrimaryProgressReport
                {
                    ProgressReportId = progRep.Id,
                    StudentNumber = studentNumber
                };
                await dbContext.StudentPrePrimaryProgressReports.AddAsync(record);
                await dbContext.SaveChangesAsync();

                var result = await createDevelopmentAssessmentGradeRecords(new List<StudentPrePrimaryProgressReport>() { record }, progRep.Terms);
                if (!string.IsNullOrEmpty(result.errorMessage))
                    return result;
            }

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }



    /*----   CREATE DEVELOPMENT ASSESSMENT GRADE RECORDS  ----*/
    /// <summary>
    ///     creates assessment grades in bulk for each student progress report passed in.
    /// </summary>
    /// <param name="studentProgressReports">The student progress reports to create records for</param>
    /// <param name="terms">The number of terms to create the records for</param>
    /// <returns>A Response object indicating success or failure.</returns>
    private async Task<Response> createDevelopmentAssessmentGradeRecords(List<StudentPrePrimaryProgressReport> studentProgressReports, int terms)
    {
        try
        {
            // get all development assessments
            var assessments = await dbContext.DevelopmentAssessments.ToListAsync();

            // create assessment grade records
            var assessmentGrades = new List<DevelopmentAssessmentGrade>();
            studentProgressReports.ForEach(studentProgressReport =>
            {
                // create records
                assessments.ForEach(assessment =>
                {
                    for (int i = 1; i <= terms; i++)
                    {
                        assessmentGrades.Add(new DevelopmentAssessmentGrade()
                        {
                            AssessmentId = assessment.Id,
                            StudentProgressReportId = studentProgressReport.Id,
                            Grade = "",
                            Term = i
                        });
                    }
                });
            });

            // save to db
            await dbContext.DevelopmentAssessmentGrades.AddRangeAsync(assessmentGrades);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = "" };
        }
    }

    //---   EDIT DEVELOPMENT ASSESSMENT GRADE  ---
    /// <summary>
    ///     edit development assessment grade
    /// </summary>
    /// <param name="details">details of the grade to edit</param>
    /// <returns>A Response object indicating success or failure.</returns>
    public async Task<Response> EditDevelopmentAssessmentGrade(EditReportGrade details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "empty values", data = 400 };

            // get record
            var grade = await dbContext.DevelopmentAssessmentGrades.FirstOrDefaultAsync(p => p.Id == details.id);
            if (grade is null)
                return new Response { errorMessage = "Record not found", data = 404 };

            // check for valid int
            int newGrade = 0;
            if (!int.TryParse(details.grade, out newGrade))
            {
                return new Response { errorMessage = "Grade is not a number", data = 400 };
            }

            // check if grade is in range
            if (newGrade < 1 || newGrade > 3)
            {
                return new Response { errorMessage = "Invalid grade. Must be between 1 and 3", data = 400 };
            }

            // edit grade 
            grade.Grade = details.grade;

            // save to database
            dbContext.DevelopmentAssessmentGrades.Update(grade);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----  ADD DEVELOPMENT ASSESSMENT GRADES BY TERM   ----*/
    /// <summary>
    ///     adds development assessment grades until the desired num is reached
    /// </summary>
    /// <param name="progressReportId">id of progress report for which to add terms</param>
    /// <param name="numOfTerms">the number of terms which a progress report should have</param>
    /// <returns>A Response object indicating success or failure.</returns>
    public async Task<Response> AddDevelopmentAssessmentGradesByTerm(int progressReportId, int numOfTerms)
    {
        try
        {
            var studentProgressReports = await (
                from p in dbContext.PrePrimaryProgressReports
                join sp in dbContext.StudentPrePrimaryProgressReports on p.Id equals sp.ProgressReportId
                where p.Id == progressReportId
                select sp
            ).ToListAsync();

            var currentTermCount = (await (
                from p in dbContext.PrePrimaryProgressReports
                join sp in dbContext.StudentPrePrimaryProgressReports on p.Id equals sp.ProgressReportId
                join g in dbContext.DevelopmentAssessmentGrades on sp.Id equals g.StudentProgressReportId
                where p.Id == progressReportId
                select g
            ).ToListAsync()).Max(val => val.Term);

            var assessments = await dbContext.DevelopmentAssessments.ToListAsync();
            List<DevelopmentAssessmentGrade> assessmentGrades = new List<DevelopmentAssessmentGrade>();
            foreach (var progressReport in studentProgressReports)
            {
                foreach (var assessment in assessments)
                {
                    for (int i = currentTermCount + 1; i <= numOfTerms; i++)
                    {
                        assessmentGrades.Add(new DevelopmentAssessmentGrade()
                        {
                            AssessmentId = assessment.Id,
                            StudentProgressReportId = progressReport.Id,
                            Grade = "",
                            Term = i
                        });
                    }
                }
            }

            await dbContext.DevelopmentAssessmentGrades.AddRangeAsync(assessmentGrades);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----  DELETE DEVELOPMENT ASSESSMENT GRADES BY TERM   ----*/
    /// <summary>
    ///     deletes assessment grades of student pre primary progress report with a term greater than the one specified
    /// </summary>
    /// <param name="progressReportId">id of progress report for which to delete grades</param>
    /// <param name="maxTerms">the maximum number of terms the progress report should have. Any number greater than this will be deleted</param>
    /// <returns>A Response object indicating success or failure.</returns>
    public async Task<Response> DeleteDevelopmentAssessmentGradesByTerm(int progressReportId, int maxTerms)
    {
        try
        {
            var assessmentGrades = await (
                from p in dbContext.PrePrimaryProgressReports
                join sp in dbContext.StudentPrePrimaryProgressReports on p.Id equals sp.ProgressReportId
                join g in dbContext.DevelopmentAssessmentGrades on sp.Id equals g.StudentProgressReportId
                where p.Id == progressReportId
                && g.Term > maxTerms
                select g
            ).ToListAsync();

            dbContext.DevelopmentAssessmentGrades.RemoveRange(assessmentGrades);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----  DELETE   ----*/
    /// <summary>
    ///     deletes a pre primary progress report
    /// </summary>
    /// <param name="id">id of progress report to delete</param>
    /// <returns>A Response object indicating success or failure.</returns>
    public async Task<Response> Delete(int id)
    {
        try
        {
            var record = await dbContext.PrePrimaryProgressReports.FirstOrDefaultAsync(p => p.Id == id);
            if (record is null)
                return new Response { errorMessage = "Progress report not found", data = 404 };

            dbContext.PrePrimaryProgressReports.Remove(record);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----  DELETE ALL STUDENT PROGRESS REPORTS   ----*/
    /// <summary>
    ///     deletes all pre primary progress reports for student
    /// </summary>
    /// <param name="studentNumber">student number of student whose records to be deleted</param>
    /// <returns>A Response object indicating success or failure.</returns>
    public async Task<Response> DeleteAllStudentProgressReports(string studentNumber)
    {
        try
        {
            var records = await dbContext.StudentPrePrimaryProgressReports.Where(s => s.StudentNumber == studentNumber).ToListAsync();

            dbContext.StudentPrePrimaryProgressReports.RemoveRange(records);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
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