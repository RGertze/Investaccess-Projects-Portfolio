using SCA_ITS_back_end.Helpers;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Utilities;
using Microsoft.EntityFrameworkCore;
using PuppeteerSharp;
using PuppeteerSharp.Media;

namespace SCA_ITS_back_end.Services;

enum SUBJECT_TYPE
{
    CORE = 1,
    VOCATIONAL = 2,
    SUPPORT = 3
}

class ReportGenerationBackroundService : BackgroundService
{
    private ILogger<ReportGenerationBackroundService> _logger;
    private IServiceScope _serviceScope;
    private IS3Service _s3Service;
    private SCA_ITSContext dbContext;
    private IViewRenderService _viewRenderService;

    public ReportGenerationBackroundService(ILogger<ReportGenerationBackroundService> logger, IServiceProvider serviceProvider, IS3Service s3Service)
    {
        this._logger = logger;
        this._serviceScope = serviceProvider.CreateScope();
        this._s3Service = s3Service;

        this._viewRenderService = this._serviceScope.ServiceProvider.GetRequiredService<IViewRenderService>();

        this.dbContext = serviceProvider.CreateScope().ServiceProvider.GetRequiredService<SCA_ITSContext>();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // using PeriodicTimer timer = new PeriodicTimer(TimeSpan.FromSeconds(2));
        while (!stoppingToken.IsCancellationRequested)
        {
            // get oldest incomplete job
            var job = await getNextJob();

            if (job is not null)
            {
                // run job
                await generateFiles(job);
            }

            // sleep for 5 seconds
            await Task.Delay(TimeSpan.FromSeconds(5));
        }
    }


    #region Start job

    //----   1. GET OLDEST INCOMPLETE GENERATION JOB   ----
    private async Task<ReportGenerationJob?> getNextJob()
    {
        try
        {
            var job = await dbContext.ReportGenerationJobs.Where(rgj => rgj.Status == (int)FileStatus.PENDING || rgj.Status == (int)FileStatus.RUNNING).OrderBy(rgj => rgj.CreatedAt).FirstOrDefaultAsync();

            // set status to running
            if (job is not null)
            {
                job.Status = (int)FileStatus.RUNNING;

                dbContext.ReportGenerationJobs.Update(job);
                await dbContext.SaveChangesAsync();
            }

            return job;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return null;
        }
    }


    //----   2. GENERATE FILES FOR JOB   ----
    private async Task generateFiles(ReportGenerationJob job)
    {
        // get reports to be generated
        var reports = await getReportsToGenerate(job);

        // create generated file records 
        await createGeneratedFileRecords(job, reports);

        // get incomplete generated file records
        var filesToGenerate = await getPendingGeneratedFileRecords(job);

        // generate files 1 by 1
        foreach (var file in filesToGenerate)
        {
            await generateFile(job, file);
        }

        // set job to complete
        await setJobToComplete(job);
    }

    //----   3. GET REPORTS TO GENERATE   ----
    private async Task<List<Report>> getReportsToGenerate(ReportGenerationJob job)
    {
        try
        {
            return await dbContext.Reports.Where(r => r.ReportGroupId == job.ReportGroupId).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new List<Report>();
        }
    }

    //----   4. CREATE GENERATED FILE RECORDS   ----
    private async Task createGeneratedFileRecords(ReportGenerationJob job, List<Report> reports)
    {
        try
        {
            // get existing created records
            var existingRecords = await dbContext.GeneratedReportFiles.Where(grf => grf.JobId == job.Id).ToListAsync();

            // filter reports to those without records
            var reportsToAdd = new List<Report>();
            reports.ForEach(report =>
            {
                if (!existingRecords.Any(er => er.ReportId == report.Id))
                {
                    reportsToAdd.Add(report);
                }
            });

            // create records
            var generatedFileRecords = new List<GeneratedReportFile>();
            reportsToAdd.ForEach(report =>
            {
                generatedFileRecords.Add(new GeneratedReportFile()
                {
                    FilePath = "",
                    ReportId = report.Id,
                    JobId = job.Id,
                    Status = (int)FileStatus.PENDING        // pending
                });
            });

            // save to db
            await dbContext.GeneratedReportFiles.AddRangeAsync(generatedFileRecords);
            await dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
        }
    }

    //----   5. GET PENDING GENERATED FILE RECORDS   ----
    private async Task<List<GeneratedReportFile>> getPendingGeneratedFileRecords(ReportGenerationJob job)
    {
        try
        {
            return await dbContext.GeneratedReportFiles.Where(r => r.JobId == job.Id && (r.Status == (int)FileStatus.PENDING || r.Status == (int)FileStatus.RUNNING)).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new List<GeneratedReportFile>();
        }
    }

    #endregion

    #region Generate file

    //----   6. GENERATE SINGLE FILE   ----
    private async Task generateFile(ReportGenerationJob job, GeneratedReportFile file)
    {
        try
        {
            // set file status to running
            file.Status = (int)FileStatus.RUNNING;
            dbContext.GeneratedReportFiles.Update(file);
            await dbContext.SaveChangesAsync();

            // get html
            var result = await generateHtml(job, file);
            if (result.errorMessage != "")
            {
                throw new Exception("Failed to generate html: " + result.errorMessage);
            }
            Console.WriteLine(result.data);

            // convert to pdf
            result = await generatePdf(result.data);
            if (result.errorMessage != "")
            {
                throw new Exception("Failed to generate pdf: " + result.errorMessage);
            }

            // upload to s3
            var filePath = $"{Guid.NewGuid()}-{file.ReportId}.pdf";
            var uploaded = await this._s3Service.uploadStreamObject(filePath, result.data);
            if (!uploaded)
            {
                throw new Exception("Failed to upload report");
            }

            // update status and file path
            file.FilePath = filePath;
            file.Status = (int)FileStatus.SUCCESSFUL;
            dbContext.GeneratedReportFiles.Update(file);
            await dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);

            try
            {
                // set file status to failed and set failure message
                file.Status = (int)FileStatus.FAILED;
                file.FailureMessage = ex.Message;
                dbContext.GeneratedReportFiles.Update(file);
                await dbContext.SaveChangesAsync();
            }
            catch (Exception ex2)
            {
                Console.WriteLine(ex2.Message);
                Console.WriteLine(ex2.Source);
                Console.WriteLine(ex2.TargetSite);
            }
        }
    }

    //----   7. GENERATE HTML STRINGS   ----
    private async Task<Models.Response> generateHtml(ReportGenerationJob job, GeneratedReportFile fileToGenerate)
    {
        try
        {
            // get report group
            var reportGroup = await dbContext.ReportGroups.FirstOrDefaultAsync(rg => rg.Id == job.ReportGroupId);
            if (reportGroup is null)
                return new Models.Response { errorMessage = "Report group not found", data = 404 };

            // get student
            var student = await getStudent(fileToGenerate);
            if (student is null)
                return new Models.Response { errorMessage = "Student not found", data = "" };

            // get report type
            var reportType = await dbContext.Reports.Where(r => r.Id == fileToGenerate.ReportId).Select(r => r.ReportTypeId).FirstOrDefaultAsync();
            if (reportType is 0)
                return new Models.Response { errorMessage = "Report type not found", data = "" };

            if (reportType == (int)REPORT_TYPE.PRIMARY)
            {
                // get report details
                var details = await dbContext.PrimaryReportDetails.Where(rd => rd.ReportId == fileToGenerate.ReportId).FirstOrDefaultAsync();
                if (details is null)
                    return new Models.Response { errorMessage = "Report details not found", data = "" };

                // get core subjects for student
                var coreSubjects = await getSubjectsForStudent(student, SUBJECT_TYPE.CORE);
                Console.WriteLine(coreSubjects.Count.ToString());

                // get vocational subjects for student
                var vocationalSubjects = await getSubjectsForStudent(student, SUBJECT_TYPE.VOCATIONAL);

                // get support subjects for student
                var supportSubjects = await getSubjectsForStudent(student, SUBJECT_TYPE.SUPPORT);

                // get student marks for each term
                var studentTermMarks = new List<List<decimal>>();
                for (int i = 1; i <= job.Term; i++)
                {
                    studentTermMarks.Add(await getStudentMarksForTerm(student, coreSubjects, vocationalSubjects, supportSubjects, i));
                }

                // get average marks for each term
                var averageTermMarks = new List<List<decimal>>();
                for (int i = 1; i <= job.Term; i++)
                {
                    averageTermMarks.Add(await getAverageMarksForTerm(coreSubjects, vocationalSubjects, supportSubjects, i));
                }

                // get course remarks
                var courseRemarks = await getCourseRemarksForStudent(student, fileToGenerate);

                // get persona categories
                var personaCategories = await getPersonaCategories();

                // get personas
                var personas = await getPersonas();

                // get persona grades
                var personaGrades = await getPersonaGradesForReport(fileToGenerate);

                //--  start building report  --

                if (job.Term is null)
                {
                    return new Models.Response { errorMessage = "Term not set", data = "" };
                }

                DateTime today = DateTime.Today;
                var primaryReport = new PrimaryReport(student.FirstName, student.LastName, student.Grade.ToString(), today.ToString("dd/MM/yyyy"), (int)job.Term, today.Year.ToString(), (int)details.DaysAbsent);

                // add subjects
                primaryReport.addCoreSubjects(coreSubjects.Select(course => course.Name).ToList());
                primaryReport.addVocationalSubjects(vocationalSubjects.Select(course => course.Name).ToList());
                primaryReport.addSupportSubjects(supportSubjects.Select(course => course.Name).ToList());

                // add term marks
                for (int i = 0; i < job.Term; i++)
                {
                    primaryReport.addTermRow(studentTermMarks[i], averageTermMarks[i], i + 1);
                }

                // add progress report comments
                primaryReport.addProgressReportComments("");

                // add course remarks
                primaryReport.addCourseRemarks(courseRemarks);

                // add persona grades
                primaryReport.addPersonaMarks(personaCategories, personas, personaGrades, (int)job.Term);

                // add progress report comments
                primaryReport.addProgressReportComments("This report must be read in conjunction with the persona motivation assessment");

                // add brief comments
                primaryReport.addBriefComments(details.PersonaBriefComments);

                // build string and return
                var html = await _viewRenderService.RenderToStringAsync("PrimaryReport", primaryReport);

                return new Models.Response { errorMessage = "", data = html };
            }

            if (reportType == (int)REPORT_TYPE.PRE_PRIMARY)
            {
                // get report details
                var details = await dbContext.PrePrimaryReportDetails.Where(rd => rd.ReportId == fileToGenerate.ReportId).FirstOrDefaultAsync();
                if (details is null)
                    return new Models.Response { errorMessage = "Report Details not found", data = "" };

                // get the progress report for the student for the current job's year
                var prePrimaryProgressReport = await dbContext.PrePrimaryProgressReports.FirstOrDefaultAsync(p => p.Year == reportGroup.Year);
                if (prePrimaryProgressReport is null)
                    return new Models.Response { errorMessage = "Progress report for year not found", data = 404 };
                var studentPrePrimaryProgressReport = await dbContext.StudentPrePrimaryProgressReports.FirstOrDefaultAsync(p => p.ProgressReportId == prePrimaryProgressReport.Id && p.StudentNumber == student.StudentNumber);
                if (studentPrePrimaryProgressReport is null)
                    return new Models.Response { errorMessage = "Student progress report not found", data = 404 };

                var devGroups = await dbContext.DevelopmentGroups.ToListAsync();
                var devCategories = await dbContext.DevelopmentCategories.ToListAsync();
                var devAssessments = await dbContext.DevelopmentAssessments.ToListAsync();
                var devAssessmentGrades = await dbContext.DevelopmentAssessmentGrades.Where(grade => grade.StudentProgressReportId == studentPrePrimaryProgressReport.Id).ToListAsync();

                int daysAbsent = (int)details.DaysAbsent;

                var prePrimaryReport = new PrePrimaryReport(student.FirstName, student.LastName, student.Grade.ToString(), DateTime.Today.ToString("dd/MM/yyyy"), (int)job.Term, DateTime.Today.Year.ToString(), daysAbsent);

                prePrimaryReport.remarks = details.Remarks;
                prePrimaryReport.addAssessments(devGroups, devCategories, devAssessments, devAssessmentGrades, (int)job.Term);

                var html = await _viewRenderService.RenderToStringAsync("PrePrimaryReport", prePrimaryReport);

                return new Models.Response { errorMessage = "", data = html };
            }

            return new Models.Response { errorMessage = "Invalid report type", data = "" };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.TargetSite);
            return new Models.Response { errorMessage = ex.Message, data = "" };
        }
    }

    //----   17. GENERATE PDF   ----
    private async Task<Models.Response> generatePdf(string html)
    {
        try
        {
            await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
            {
                Headless = true,
                ExecutablePath = "/usr/bin/google-chrome-stable",
                Args = new String[] { "--no-sandbox" }
            });
            await using var page = await browser.NewPageAsync();
            await page.EmulateMediaTypeAsync(MediaType.Screen);
            await page.SetContentAsync(html);
            var pdfContent = await page.PdfStreamAsync(new PdfOptions
            {
                Format = PaperFormat.A3,
                PrintBackground = true,
                MarginOptions = new MarginOptions
                {
                    Top = "20px"
                }
            });
            return new Models.Response { errorMessage = "", data = pdfContent };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Models.Response { errorMessage = ex.Message, data = null };
        }
    }


    #endregion

    #region Complete job

    //----   18. SET JOB TO COMPLETE   ----
    private async Task<Models.Response> setJobToComplete(ReportGenerationJob job)
    {
        try
        {
            // check if all files were successfully generated 
            var success = await dbContext.GeneratedReportFiles.AnyAsync(grf => grf.JobId == job.Id && grf.Status != (int)FileStatus.SUCCESSFUL);

            if (success)
                job.Status = (int)FileStatus.SUCCESSFUL;
            else
                job.Status = (int)FileStatus.FAILED;

            dbContext.ReportGenerationJobs.Update(job);
            await dbContext.SaveChangesAsync();

            return new Models.Response { errorMessage = "", data = "ok" };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Models.Response { errorMessage = ex.Message, data = "" };
        }
    }

    #endregion


    #region Get student report details

    //----   8. GET STUDENT   ----
    private async Task<Student?> getStudent(GeneratedReportFile fileToGenerate)
    {
        try
        {
            var studentToReturn = await (
                from report in dbContext.Reports
                join student in dbContext.Students on report.StudentNumber equals student.StudentNumber
                where report.Id == fileToGenerate.ReportId
                select student
            ).FirstOrDefaultAsync();
            return studentToReturn;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return null;
        }
    }

    //----   9. GET SUBJECTS FOR STUDENT   ----
    private async Task<List<Course>> getSubjectsForStudent(Student student, SUBJECT_TYPE subject)
    {
        try
        {
            var subjects = await (
                from course in dbContext.Courses
                join courseStudent in dbContext.CourseStudents on course.Id equals courseStudent.CourseId
                where courseStudent.StudentNumber == student.StudentNumber
                && course.TypeId == (int)subject
                orderby course.Id descending
                select course
            ).ToListAsync();
            return subjects;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new List<Course>();
        }
    }

    //----   10. GET STUDENT MARKS FOR TERM   ----
    private async Task<List<decimal>> getStudentMarksForTerm(Student student, List<Course> coreSubjects, List<Course> vocationalSubjects, List<Course> supportSubjects, int term)
    {
        var studentMarks = new List<decimal>();

        // get core marks 
        foreach (var subject in coreSubjects)
        {
            studentMarks.Add(await getSubjectMarkForTerm(student, subject, term));
        }

        // get vocational marks 
        foreach (var subject in vocationalSubjects)
        {
            studentMarks.Add(await getSubjectMarkForTerm(student, subject, term));
        }

        // get support marks
        foreach (var subject in supportSubjects)
        {
            studentMarks.Add(await getSubjectMarkForTerm(student, subject, term));
        }

        return studentMarks;
    }

    //----   11. GET SUBJECT MARK FOR TERM   ----
    private async Task<decimal> getSubjectMarkForTerm(Student student, Course subject, int term)
    {
        try
        {
            // get latest course progress report
            var courseProgressReport = await dbContext.CourseProgressReports.Where(cpr => cpr.CourseId == subject.Id).OrderBy(cpr => cpr.Id).FirstAsync();

            // get progress report template
            var progressReportTemplate = await dbContext.ProgressReportTemplates.Where(prt => prt.Id == courseProgressReport.ProgressReportId).FirstAsync();

            // get progress report categories
            var categories = await dbContext.ProgressReportCategories.Where(prc => prc.ProgressReportId == progressReportTemplate.Id).ToListAsync();

            // get student progress reports
            var studentProgressReport = await dbContext.StudentProgressReports.Where(spr => spr.CourseProgressReportId == courseProgressReport.Id && spr.StudentNumber == student.StudentNumber).FirstAsync();

            // get student marks for term
            var studentAssessments = await (
                from studentAssessment in dbContext.StudentProgressReportAssessments
                join assessment in dbContext.ProgressReportAssessments on studentAssessment.ProgressReportAssessmentId equals assessment.Id
                where studentAssessment.StudentProgressReportId == studentProgressReport.Id && studentAssessment.Term == term
                select new
                {
                    assessment.ProgressReportCategoryId,
                    assessment.MarksAvailable,
                    studentAssessment.Mark,
                }
            ).ToListAsync();

            // get student exam mark for term
            var examMark = await dbContext.StudentProgressReportExamMarks.Where(ex => ex.StudentProgressReportId == studentProgressReport.Id && ex.Term == term).FirstAsync();


            // calculate final cass mark 
            decimal finalCassMark = 0;

            // calculate marks per category
            categories.ForEach(cat =>
            {
                // get assessments per category
                var assPerCat = studentAssessments.Where(sa => sa.ProgressReportCategoryId == cat.Id);

                // calculate total
                decimal total = 0;
                studentAssessments.ForEach(sa =>
                {
                    total += (sa.Mark / sa.MarksAvailable * 100);
                });

                // add to final cass mark by weight
                finalCassMark += ((total / studentAssessments.Count) / 100 * cat.Weight);
            });

            // calculate exam mark 
            decimal finalExamMark = (examMark.Mark / progressReportTemplate.ExamMarksAvailable) * progressReportTemplate.ExamWeight;

            // calculate final mark
            decimal finalMark = finalCassMark + finalExamMark;

            return finalMark;

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return 0;
        }
    }

    //----   12. GET AVERAGE MARKS FOR TERM   ----
    private async Task<List<decimal>> getAverageMarksForTerm(List<Course> coreSubjects, List<Course> vocationalSubjects, List<Course> supportSubjects, int term)
    {
        var averageMarks = new List<decimal>();

        // concat lists
        var subjects = new List<Course>();
        subjects.AddRange(coreSubjects);
        subjects.AddRange(vocationalSubjects);
        subjects.AddRange(supportSubjects);

        // get average core marks 
        foreach (var subject in subjects)
        {
            // get students in course
            var students = await (
                from student in dbContext.Students
                join cs in dbContext.CourseStudents on student.StudentNumber equals cs.StudentNumber
                where cs.CourseId == subject.Id
                select student
            ).ToListAsync();

            // get marks for each student
            decimal totalMarks = 0;
            foreach (var student in students)
            {
                totalMarks += await getSubjectMarkForTerm(student, subject, term);
            }

            // add average
            averageMarks.Add(totalMarks / ((students.Count == 0) ? 1 : students.Count));
        }

        return averageMarks;
    }

    //----   13. GET COURSE REMARKS FOR STUDENT   ----
    private async Task<List<ReportCourseRemark>> getCourseRemarksForStudent(Student student, GeneratedReportFile file)
    {
        try
        {
            var courseRemarks = await (
                from course in dbContext.Courses
                join courseRemark in dbContext.CourseRemarks on course.Id equals courseRemark.CourseId
                where courseRemark.ReportId == file.ReportId
                select new ReportCourseRemark()
                {
                    CourseName = course.Name,
                    Remark = courseRemark.Remark
                }
            ).ToListAsync();
            return courseRemarks;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new List<ReportCourseRemark>();
        }
    }

    //----   14. GET PERSONA CATEGORIES   ----
    private async Task<List<PersonaCategory>> getPersonaCategories()
    {
        try
        {
            var categories = await dbContext.PersonaCategories.ToListAsync();
            return categories;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new List<PersonaCategory>();
        }
    }

    //----   15. GET PERSONAS   ----
    private async Task<List<Persona>> getPersonas()
    {
        try
        {
            var personas = await dbContext.Personas.ToListAsync();
            return personas;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new List<Persona>();
        }
    }

    //----   16. GET PERSONA GRADES FOR REPORT   ----
    private async Task<List<PersonaGrade>> getPersonaGradesForReport(GeneratedReportFile file)
    {
        try
        {
            var personaGrades = await dbContext.PersonaGrades.Where(pg => pg.ReportId == file.ReportId).ToListAsync();
            return personaGrades;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new List<PersonaGrade>();
        }
    }

    #endregion
}