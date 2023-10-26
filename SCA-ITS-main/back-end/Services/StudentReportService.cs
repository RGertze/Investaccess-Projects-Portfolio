
using System.Data;
using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;

namespace SCA_ITS_back_end.Services;

public class StudentReportService
{
    private readonly SCA_ITSContext dbContext;

    public StudentReportService(SCA_ITSContext dbContext)
    {
        this.dbContext = dbContext;
    }

    /*----   ADD REPORTS FOR ALL PRIMARY STUDENTS   ----*/
    public async Task<Response> AddReportsForAllPrimaryStudents(int reportGroupId, int terms)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // get all students in grade > 0
            var students = await dbContext.Students.Where(s => s.Grade > 0).ToListAsync();

            // create report records
            var result = await createReportRecords(reportGroupId, (int)REPORT_TYPE.PRIMARY, students);
            if (result.errorMessage.Length > 0)
            {
                throw new Exception(result.errorMessage);
            }
            var reports = (List<Report>)result.data;

            // create course remark records
            result = await createCourseRemarkRecords(reports);
            if (result.errorMessage.Length > 0)
            {
                throw new Exception(result.errorMessage);
            }

            // create persona grade records
            result = await createPersonaGradeRecords(reports, terms);
            if (result.errorMessage.Length > 0)
            {
                throw new Exception(result.errorMessage);
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later: " + ex.Message, data = "" };
        }
    }

    /*----   ADD REPORTS FOR ALL PRE PRIMARY STUDENTS   ----*/
    public async Task<Response> AddReportsForAllPrePrimaryStudents(int reportGroupId, int terms)
    {
        using var transaction = await dbContext.Database.BeginTransactionAsync();

        try
        {
            // get all students in grade 0
            var students = await dbContext.Students.Where(s => s.Grade == 0).ToListAsync();

            // create report records
            var result = await createReportRecords(reportGroupId, (int)REPORT_TYPE.PRE_PRIMARY, students);
            if (result.errorMessage.Length > 0)
                throw new Exception(result.errorMessage);

            await transaction.CommitAsync();

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

    /*----   CREATE REPORT RECORDS  ----*/
    private async Task<Response> createReportRecords(int reportGroupId, int reportTypeId, List<Student> students)
    {
        try
        {
            var reports = new List<Report>();

            // create reports
            foreach (var student in students)
            {
                reports.Add(new Report()
                {
                    ReportGroupId = reportGroupId,
                    ReportTypeId = reportTypeId,
                    StudentNumber = student.StudentNumber,
                });
            }

            // save to db
            await dbContext.Reports.AddRangeAsync(reports);
            await dbContext.SaveChangesAsync();


            var primaryReportDetails = new List<PrimaryReportDetail>();
            var prePrimaryReportDetails = new List<PrePrimaryReportDetail>();

            // create report details
            for (int i = 0; i < students.Count; i++)
            {
                var report = reports.FirstOrDefault(r => r.StudentNumber == students[i].StudentNumber);
                if (report is null)
                    continue;

                if (students[i].Grade == 0)
                {
                    prePrimaryReportDetails.Add(new PrePrimaryReportDetail()
                    {
                        DaysAbsent = 0,
                        DominantHand = 1,
                        RegisterTeacher = "",
                        Remarks = "",
                        ReportId = report.Id
                    });
                    continue;
                }
                primaryReportDetails.Add(new PrimaryReportDetail()
                {
                    DaysAbsent = 0,
                    PersonaBriefComments = "",
                    RegisterTeacher = "",
                    ReportId = report.Id
                });
            }

            // save to db
            await dbContext.PrePrimaryReportDetails.AddRangeAsync(prePrimaryReportDetails);
            await dbContext.PrimaryReportDetails.AddRangeAsync(primaryReportDetails);
            await dbContext.SaveChangesAsync();

            return new Response
            {
                errorMessage = "",
                data = reports
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = "" };
        }
    }

    /*----   CREATE COURSE REMARK RECORDS  ----*/
    private async Task<Response> createCourseRemarkRecords(List<Report> reports)
    {
        try
        {
            // create course remark records
            var courseRemarks = new List<CourseRemark>();
            reports.ForEach(report =>
            {
                // get all current courses for student
                var courses = dbContext.CourseStudents.Where(cs => cs.StudentNumber == report.StudentNumber).ToList();

                // create records
                courses.ForEach(course =>
                {
                    courseRemarks.Add(new CourseRemark()
                    {
                        CourseId = course.CourseId,
                        ReportId = report.Id,
                        Remark = "",
                        Initials = ""
                    });
                });
            });

            // save to db
            await dbContext.CourseRemarks.AddRangeAsync(courseRemarks);
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

    /*----   CREATE PERSONA GRADE RECORDS  ----*/
    private async Task<Response> createPersonaGradeRecords(List<Report> reports, int terms)
    {
        try
        {
            // get all personas
            var personas = await dbContext.Personas.ToListAsync();

            // create persona grade records
            var personaGrades = new List<PersonaGrade>();
            reports.ForEach(report =>
            {
                // create records
                personas.ForEach(persona =>
                {
                    for (int i = 1; i <= terms; i++)
                    {
                        personaGrades.Add(new PersonaGrade()
                        {
                            PersonaId = persona.Id,
                            ReportId = report.Id,
                            Grade = "",
                            Term = i
                        });
                    }
                });
            });

            // save to db
            await dbContext.PersonaGrades.AddRangeAsync(personaGrades);
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


    /*----   CREATE REPORT FOR PRIMARY STUDENT FOR LATEST REPORT GROUP  ----*/
    public async Task<Response> CreateReportForPrimaryStudentForLatestReportGroup(Student student)
    {
        try
        {
            // get latest report group
            var reportGroup = await dbContext.ReportGroups.OrderByDescending(rg => rg.Id).FirstOrDefaultAsync();
            if (reportGroup is null)
            {
                return new Response { errorMessage = "", data = new { message = "ok" } };
            }

            // create report record for student
            var result = await this.createReportRecords(reportGroup.Id, (int)REPORT_TYPE.PRIMARY, new List<Student>() { student });
            if (result.errorMessage.Length > 0)
            {
                throw new Exception(result.errorMessage);
            }

            var reports = (List<Report>)result.data;

            // create course remark records
            result = await createCourseRemarkRecords(reports);
            if (result.errorMessage.Length > 0)
            {
                throw new Exception(result.errorMessage);
            }

            // create persona grade records
            result = await createPersonaGradeRecords(reports, reportGroup.Terms);
            if (result.errorMessage.Length > 0)
            {
                throw new Exception(result.errorMessage);
            }

            result = await this.CreateFailedGenerationJobFileForLatestGenerationJobOfReportGroup(student, reportGroup.Id);
            if (result.errorMessage.Length > 0)
                throw new Exception(result.errorMessage);

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

    /*----   CREATE REPORT FOR PRE PRIMARY STUDENT FOR LATEST REPORT GROUP  ----*/
    public async Task<Response> CreateReportForPrePrimaryStudentForLatestReportGroup(Student student)
    {
        try
        {
            // get latest report group
            var reportGroup = await dbContext.ReportGroups.OrderByDescending(rg => rg.Id).FirstOrDefaultAsync();
            if (reportGroup is null)
            {
                return new Response { errorMessage = "", data = new { message = "ok" } };
            }

            // create report record for student
            var result = await this.createReportRecords(reportGroup.Id, (int)REPORT_TYPE.PRE_PRIMARY, new List<Student>() { student });
            if (result.errorMessage.Length > 0)
                throw new Exception(result.errorMessage);

            result = await this.CreateFailedGenerationJobFileForLatestGenerationJobOfReportGroup(student, reportGroup.Id);
            if (result.errorMessage.Length > 0)
                throw new Exception(result.errorMessage);

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


    /*----   CREATE FAILED GENERATION JOB FILE FOR LATEST GENERATION JOB OF REPORT GROUP  ----*/
    public async Task<Response> CreateFailedGenerationJobFileForLatestGenerationJobOfReportGroup(Student student, int reportGroupId)
    {
        try
        {
            var latestJob = await dbContext.ReportGenerationJobs.Where(rgj => rgj.ReportGroupId == reportGroupId).OrderByDescending(rgj => rgj.Id).FirstOrDefaultAsync();
            if (latestJob is null)
                return new Response { errorMessage = "", data = new { message = "ok" } };

            var report = await dbContext.Reports.FirstOrDefaultAsync(r => r.StudentNumber == student.StudentNumber && r.ReportGroupId == reportGroupId);
            if (report is null)
                return new Response { errorMessage = "Report not created", data = 404 };

            var generatedFile = new GeneratedReportFile
            {
                JobId = latestJob.Id,
                FilePath = "",
                ReportId = report.Id,
                Status = (int)FileStatus.FAILED,
                FailureMessage = "This is the file of a new student. Once you have added their marks, regenerate the file"
            };

            await dbContext.GeneratedReportFiles.AddAsync(generatedFile);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = "ok" };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }




    /*----   ADD PRIMARY COURSE REMARK RECORD FOR LATEST REPORT  ----*/
    public async Task<Response> AddPrimaryCourseRemarkForLatestReport(string studentNumber, string courseId)
    {
        try
        {
            // get latest student report
            var report = await dbContext.Reports.Where(r => r.StudentNumber == studentNumber).OrderByDescending(r => r.Id).FirstOrDefaultAsync();
            if (report is null)
            {
                return new Response { errorMessage = "", data = new { message = "ok" } };
            }

            // create record
            CourseRemark courseRemark = new CourseRemark()
            {
                CourseId = courseId,
                ReportId = report.Id,
                Remark = "",
                Initials = ""
            };

            // save to db
            await dbContext.CourseRemarks.AddAsync(courseRemark);
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

    /*----   CREATE REPORT GENERATION JOB RECORDS  ----*/
    public async Task<Response> CreateReportGenerationJobRecords(ReportGroup reportGroup, int term, string schoolReOpens)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // create record 
            var generationJob = new ReportGenerationJob()
            {
                ReportGroupId = reportGroup.Id,
                Term = term,
                SchoolReOpens = DateOnly.Parse(schoolReOpens)
            };

            // save to database
            await dbContext.ReportGenerationJobs.AddAsync(generationJob);
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

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


    /*----   DELETE REPORT FOR LATEST REPORT GROUP  ----*/
    public async Task<Response> DeleteReportForLatestReportGroup(string studentNumber)
    {
        try
        {
            var reportGroup = await dbContext.ReportGroups.OrderByDescending(rg => rg.Id).FirstOrDefaultAsync();
            if (reportGroup is null)
            {
                return new Response { errorMessage = "", data = new { message = "ok" } };
            }

            var report = await dbContext.Reports.Where(r => r.ReportGroupId == reportGroup.Id && r.StudentNumber == studentNumber).FirstOrDefaultAsync();
            if (report is null)
                return new Response { errorMessage = "", data = new { message = "ok" } };

            dbContext.Reports.Remove(report);
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


}
