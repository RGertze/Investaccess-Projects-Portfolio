
using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;

namespace SCA_ITS_back_end.Services;

public class StudentProgressReportService
{
    private readonly SCA_ITSContext dbContext;

    public StudentProgressReportService(SCA_ITSContext dbContext)
    {
        this.dbContext = dbContext;
    }

    /*----   DELETE STUDENT PROGRESS REPORTS FOR COURSE   ----*/
    public async Task<Response> DeleteStudentProgressReportsForCourse(string courseId, string studentNumber)
    {
        try
        {
            // get student progress reports
            var studentProgReps = await (
                from sp in dbContext.StudentProgressReports
                join cpr in dbContext.CourseProgressReports on sp.CourseProgressReportId equals cpr.Id
                where cpr.CourseId == courseId && sp.StudentNumber == studentNumber
                select sp
            ).ToListAsync();

            // remove from db
            dbContext.StudentProgressReports.RemoveRange(studentProgReps);
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

    /*----   ADD STUDENT PROGRESS REPORT FOR ALL STUDENTS IN COURSE   ----*/
    public async Task<Response> AddProgressReportForAllStudentsOfCourse(CourseProgressReport courseProgressReport)
    {
        using var transaction = await dbContext.Database.BeginTransactionAsync();

        try
        {
            // get all students in a course
            var students = await dbContext.CourseStudents.Where(cs => cs.CourseId == courseProgressReport.CourseId).ToListAsync();

            // if zero, return
            if (students.Count == 0)
            {
                return new Response { errorMessage = "", data = new { message = "ok" } };
            }

            // create student progress report entries
            List<StudentProgressReport> studentProgressReports = new List<StudentProgressReport>();
            students.ForEach(student =>
            {
                studentProgressReports.Add(new StudentProgressReport()
                {
                    CourseProgressReportId = courseProgressReport.Id,
                    StudentNumber = student.StudentNumber
                });
            });

            // save to db
            await dbContext.StudentProgressReports.AddRangeAsync(studentProgressReports);
            await dbContext.SaveChangesAsync();

            // get progress report assessments
            var progressReportAssessments = await (
                from pra in dbContext.ProgressReportAssessments
                join prc in dbContext.ProgressReportCategories on pra.ProgressReportCategoryId equals prc.Id
                join pr in dbContext.ProgressReportTemplates on prc.ProgressReportId equals pr.Id
                where pr.Id == courseProgressReport.ProgressReportId
                select pra
            ).ToListAsync();

            // create student progress report assessment entries for each term in progress report
            List<StudentProgressReportAssessment> studentProgressReportAssessments = new List<StudentProgressReportAssessment>();
            for (int i = 1; i <= courseProgressReport.NumberOfTerms; i++)
            {
                studentProgressReports.ForEach(studentPrgRep =>
                {
                    progressReportAssessments.ForEach(pra =>
                    {
                        studentProgressReportAssessments.Add(new StudentProgressReportAssessment()
                        {
                            ProgressReportAssessmentId = pra.Id,
                            StudentProgressReportId = studentPrgRep.Id,
                            Term = i
                        });
                    });
                });

            }

            // save to db
            await dbContext.StudentProgressReportAssessments.AddRangeAsync(studentProgressReportAssessments);
            await dbContext.SaveChangesAsync();

            // create exam mark entries
            List<StudentProgressReportExamMark> examMarks = new List<StudentProgressReportExamMark>();
            studentProgressReports.ForEach(studentPrgRep =>
            {
                for (int i = 1; i <= courseProgressReport.NumberOfTerms; i++)
                {
                    examMarks.Add(new StudentProgressReportExamMark()
                    {
                        StudentProgressReportId = studentPrgRep.Id,
                        Term = i
                    });
                }
            });

            // save to db
            await dbContext.StudentProgressReportExamMarks.AddRangeAsync(examMarks);
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

    /*----   ADD STUDENT PROGRESS REPORTS FOR NEW STUDENT   ----*/
    public async Task<Response> AddStudentProgressReportsForNewStudent(string courseId, string studentNumber)
    {
        try
        {
            // get course progress reports
            var courseProgressReports = await dbContext.CourseProgressReports.Where(cpr => cpr.CourseId == courseId).ToListAsync();

            // if zero, return
            if (courseProgressReports.Count == 0)
            {
                return new Response { errorMessage = "", data = new { message = "ok" } };
            }

            // create student progress reports
            var studentProgressReports = new List<StudentProgressReport>();
            courseProgressReports.ForEach(cpr =>
            {
                studentProgressReports.Add(new StudentProgressReport()
                {
                    CourseProgressReportId = cpr.Id,
                    StudentNumber = studentNumber
                });
            });

            // save to db
            await dbContext.StudentProgressReports.AddRangeAsync(studentProgressReports);
            await dbContext.SaveChangesAsync();


            // get assessments for all course progress reports
            var progressReportAssessments = await (
                from pra in dbContext.ProgressReportAssessments
                join prc in dbContext.ProgressReportCategories on pra.ProgressReportCategoryId equals prc.Id
                join pr in dbContext.ProgressReportTemplates on prc.ProgressReportId equals pr.Id
                join cpr in dbContext.CourseProgressReports on pr.Id equals cpr.ProgressReportId
                where cpr.CourseId == courseId
                select new
                {
                    assessmentId = pra.Id,
                    reportId = pr.Id,
                    cprId = cpr.Id,
                }
            ).ToListAsync();

            // create student progress report assessment entries and exam marks
            List<StudentProgressReportAssessment> studentProgressReportAssessments = new List<StudentProgressReportAssessment>();
            List<StudentProgressReportExamMark> examMarks = new List<StudentProgressReportExamMark>();
            courseProgressReports.ForEach(cpr =>
            {
                // filter assessments for specific progress report
                var assessments = progressReportAssessments.Where(a => a.cprId == cpr.Id).ToList();

                // find specific student progress report
                var studentPrgRep = studentProgressReports.Where(s => s.CourseProgressReportId == cpr.Id).First();

                // create student progress report assessments for each term
                for (int i = 1; i <= cpr.NumberOfTerms; i++)
                {
                    assessments.ForEach(a =>
                    {
                        studentProgressReportAssessments.Add(new StudentProgressReportAssessment()
                        {
                            ProgressReportAssessmentId = a.assessmentId,
                            StudentProgressReportId = studentPrgRep.Id,
                            Term = i
                        });
                    });

                    examMarks.Add(new StudentProgressReportExamMark()
                    {
                        StudentProgressReportId = studentPrgRep.Id,
                        Term = i
                    });
                }
            });

            // save to db
            await dbContext.StudentProgressReportAssessments.AddRangeAsync(studentProgressReportAssessments);
            await dbContext.SaveChangesAsync();

            // save to db
            await dbContext.StudentProgressReportExamMarks.AddRangeAsync(examMarks);
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

    /*----   ADD STUDENT PROGRESS REPORT ASSESSMENT FOR ALL STUDENTS   ----*/
    public async Task<Response> AddProgressReportAssessmentForAllStudents(int progressReportId, ProgressReportAssessment assessment)
    {
        try
        {
            // get all student progress reports using the changed progress report
            var studentProgressReports = await (
                from cpr in dbContext.CourseProgressReports
                join spr in dbContext.StudentProgressReports on cpr.Id equals spr.CourseProgressReportId
                where cpr.ProgressReportId == progressReportId
                select new
                {
                    spr.Id,
                    cpr.NumberOfTerms
                }
            ).ToListAsync();

            // if zero, return
            if (studentProgressReports.Count == 0)
            {
                return new Response { errorMessage = "", data = new { message = "ok" } };
            }

            // create student progress report assessment entries for each term
            List<StudentProgressReportAssessment> studentProgressReportAssessments = new List<StudentProgressReportAssessment>();
            studentProgressReports.ForEach(studentPrgRep =>
            {
                for (int i = 1; i <= studentPrgRep.NumberOfTerms; i++)
                {
                    studentProgressReportAssessments.Add(new StudentProgressReportAssessment()
                    {
                        ProgressReportAssessmentId = assessment.Id,
                        StudentProgressReportId = studentPrgRep.Id,
                        Term = i
                    });
                }
            });

            // save to db
            await dbContext.StudentProgressReportAssessments.AddRangeAsync(studentProgressReportAssessments);
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

    /*----   UPDATE STUDENT PROGRESS REPORT EXAM MARKS FOR ALL STUDENTS   ----*/
    public async Task<Response> UpdateProgressReportExamMarksForAllStudents(int progressReportId, decimal oldMarksAvailable, decimal newMarksAvailable)
    {
        try
        {
            // get all student exam marks for changed progress report
            var studentExamMarks = await (
                from cpr in dbContext.CourseProgressReports
                join spr in dbContext.StudentProgressReports on cpr.Id equals spr.CourseProgressReportId
                join em in dbContext.StudentProgressReportExamMarks on spr.Id equals em.StudentProgressReportId
                where cpr.ProgressReportId == progressReportId
                select em
            ).ToListAsync();

            // update exam marks to match the same percentage of the new available marks
            studentExamMarks.ForEach(examMark =>
            {
                decimal ratio = examMark.Mark / oldMarksAvailable;
                examMark.Mark = newMarksAvailable * ratio;
            });

            // save to db
            dbContext.UpdateRange(studentExamMarks);
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

    /*----   UPDATE STUDENT PROGRESS REPORT ASSESSMENT MARKS FOR ALL STUDENTS   ----*/
    public async Task<Response> UpdateProgressReportAssessmentMarksForAllStudents(int assessmentId, decimal oldMarksAvailable, decimal newMarksAvailable)
    {
        try
        {
            // get all student exam marks for changed progress report
            var studentAssessmentMarks = await (
                from assessment in dbContext.StudentProgressReportAssessments
                where assessment.ProgressReportAssessmentId == assessmentId
                select assessment
            ).ToListAsync();

            // update exam marks to match the same percentage of the new available marks
            studentAssessmentMarks.ForEach(assessmentMark =>
            {
                decimal ratio = assessmentMark.Mark / oldMarksAvailable;
                assessmentMark.Mark = newMarksAvailable * ratio;
            });

            // save to db
            dbContext.StudentProgressReportAssessments.UpdateRange(studentAssessmentMarks);
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