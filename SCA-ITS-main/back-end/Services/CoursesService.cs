using System.Data;
using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class CoursesService
{
    private readonly SCA_ITSContext dbContext;
    private MoodleService moodleService;
    private StudentProgressReportService studentProgressReportService;
    private StudentReportService studentReportService;

    public CoursesService(SCA_ITSContext dbContext, MoodleService moodleService, StudentProgressReportService studentProgressReportService, StudentReportService studentReportService)
    {
        this.dbContext = dbContext;
        this.moodleService = moodleService;
        this.studentProgressReportService = studentProgressReportService;
        this.studentReportService = studentReportService;
    }

    /*----  GET ALL   ----*/
    /// <summary>Get All courses</summary>
    /// <param name="details">The details of the course to add.</param>
    /// <returns>A response indicating success or failure.</returns>
    public async Task<Response> GetAll()
    {
        try
        {
            var records = await (
                from course in dbContext.Courses
                join category in dbContext.CourseCategories on course.CategoryId equals category.MoodleId
                join type in dbContext.CourseTypes on course.TypeId equals type.Id
                select new
                {
                    course.Id,
                    course.Name,
                    course.Grade,
                    course.IsPromotional,

                    categoryId = category.MoodleId,
                    categoryName = category.Name,

                    typeId = type.Id,
                    typeName = type.Name,
                }
            ).ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    /*----  ADD   ----*/
    /// <summary>Adds a course to the database.</summary>
    /// <param name="details">The details of the course to add.</param>
    /// <returns>A response indicating success or failure.</returns>
    public async Task<Response> Add(AddEditCourseRequest details, bool addToMoodle, int moodleId = 0)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "Empty values", data = 400 };
            }

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // prevent adding to default category
            if (details.categoryId == 1)
                return new Response { errorMessage = "Cannot add to default category", data = 409 };

            // check if course already exists
            if (await dbContext.Courses.AnyAsync(u => u.Id == details.courseId))
                return new Response { errorMessage = "Course already exists", data = 409 };
            if (moodleId > 0 && await dbContext.Courses.AnyAsync(u => u.MoodleId == moodleId))
                return new Response { errorMessage = "Course already exists", data = 409 };

            // create new course
            var course = new Course()
            {
                Id = details.courseId,
                MoodleId = moodleId,
                CategoryId = (int)details.categoryId,
                Name = details.name,
                Grade = (int)details.grade,
                TypeId = (int)details.typeId,
                IsPromotional = (ulong)details.isPromotional
            };

            // store in db
            await dbContext.Courses.AddAsync(course);
            await dbContext.SaveChangesAsync();

            // add to moodle
            if (addToMoodle)
            {
                var result = await moodleService.AddCourse(new MoodleAddCourseRequest
                {
                    shortname = details.courseId,
                    fullname = details.name,
                    categoryid = (int)details.categoryId
                });
                if (result.errorMessage != "")
                {
                    return new Response { errorMessage = "Failed to create moodle course: " + result.errorMessage, data = 500 };
                }

                var moodleResponse = (MoodleAddCourseResponse)result.data;
                course.MoodleId = moodleResponse.id;

                dbContext.Courses.Update(course);
                await dbContext.SaveChangesAsync();
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    /*----  EDIT   ----*/
    /// <summary>Edits a course.</summary>
    /// <param name="details">The details of the course to edit.</param>
    /// <returns>A response indicating success or failure.</returns>
    public async Task<Response> Edit(AddEditCourseRequest details, bool updateOnMoodle)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (details.courseId is null)
            {
                return new Response { errorMessage = "Course id not provided", data = 400 };
            }

            // check if course exists
            var course = await dbContext.Courses.FirstOrDefaultAsync(c => c.Id == details.courseId);
            if (course is null)
            {
                return new Response { errorMessage = "Course not found", data = 404 };
            }

            // edit course
            course.CategoryId = details.categoryId ?? course.CategoryId;
            course.Grade = details.grade ?? course.Grade;
            course.Name = details.name ?? course.Name;
            course.TypeId = details.typeId ?? course.TypeId;
            course.IsPromotional = details.isPromotional != null ? (ulong)details.isPromotional : course.IsPromotional;

            // store in db
            dbContext.Courses.Update(course);
            await dbContext.SaveChangesAsync();

            // update on moodle
            if (updateOnMoodle)
            {
                var result = await moodleService.EditCourse(new MoodleEditCourseRequest
                {
                    id = course.MoodleId,
                    categoryid = details.categoryId,
                    name = details.name
                });
                if (result.errorMessage != "")
                {
                    return new Response { errorMessage = "Failed to update moodle course: " + result.errorMessage, data = 500 };
                }
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    /*----  DELETE   ----*/
    public async Task<Response> Delete(string courseId, bool deleteFromMoodle)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var course = await dbContext.Courses.Where(cs => cs.Id == courseId).FirstOrDefaultAsync();
            if (course is null)
            {
                return new Response { errorMessage = "Record not found", data = 404 };
            }

            dbContext.Courses.Remove(course);
            await dbContext.SaveChangesAsync();

            // delete from moodle
            if (deleteFromMoodle)
            {
                var result = await moodleService.DeleteCourse(new MoodleDeleteCourseRequest
                {
                    id = course.MoodleId
                });
                if (result.errorMessage != "")
                {
                    return new Response { errorMessage = "Failed to delete moodle course: " + result.errorMessage, data = 500 };
                }
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }


    #region Course Users

    /*----  ADD COURSE STAFF   ----*/
    /// <summary>Adds a staff member to a course</summary>
    /// <param name="details">The details of the course and staff to add.</param>
    /// <returns>A response indicating success or failure.</returns>
    public async Task<Response> AddStaff(AddCourseStaff details, bool addToMoodle)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "Empty values", data = 400 };
            }

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // check if staff exists
            var staff = await dbContext.UserAccounts.FirstOrDefaultAsync(u => u.UserId == details.staffId && u.UserTypeId == 3);
            if (staff is null)
            {
                return new Response { errorMessage = "Staff does not exist", data = 404 };
            }

            // check if course exists
            var course = await dbContext.Courses.FirstOrDefaultAsync(c => c.Id == details.courseId);
            if (course is null)
            {
                return new Response { errorMessage = "Course does not exist", data = 404 };
            }

            // check if course staff already exists
            if (await dbContext.CourseStaffs.AnyAsync(cs => cs.CourseId == details.courseId && cs.StaffId == details.staffId))
            {
                return new Response { errorMessage = "Already a staff member of this course", data = 409 };
            }

            // create new course staff
            var courseStaff = new CourseStaff()
            {
                CourseId = details.courseId,
                StaffId = (int)details.staffId,
            };

            // store in db
            await dbContext.CourseStaffs.AddAsync(courseStaff);
            await dbContext.SaveChangesAsync();

            // add to moodle
            if (addToMoodle)
            {
                var result = await moodleService.EnrolInCourseByUsername(staff.Email, course.MoodleId, (int)MoodleCourseRoles.TEACHER);
                if (result.errorMessage != "")
                {
                    return new Response { errorMessage = "Failed to enrol user in moodle course: " + result.errorMessage, data = 500 };
                }
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    /*----  ADD COURSE STUDENT   ----*/
    /// <summary>Adds a student to a course</summary>
    /// <param name="details">The details of the course and student to add.</param>
    /// <returns>A response indicating success or failure.</returns>
    public async Task<Response> AddStudent(AddCourseStudent details, bool addToMoodle)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "Empty values", data = 400 };
            }

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // check if student exists
            var student = await dbContext.Students.FirstOrDefaultAsync(s => s.StudentNumber == details.studentNumber);
            if (student is null)
            {
                return new Response { errorMessage = "Student does not exist", data = 404 };
            }

            // check if course exists
            var course = await dbContext.Courses.FirstOrDefaultAsync(c => c.Id == details.courseId);
            if (course is null)
            {
                return new Response { errorMessage = "Course does not exist", data = 404 };
            }

            // check if course staff already exists
            if (await dbContext.CourseStudents.AnyAsync(cs => cs.CourseId == details.courseId && cs.StudentNumber == details.studentNumber))
            {
                return new Response { errorMessage = "Already a student of this course", data = 409 };
            }

            // create new course student
            var courseStudent = new CourseStudent()
            {
                CourseId = details.courseId,
                StudentNumber = details.studentNumber,
            };

            // store in db
            await dbContext.CourseStudents.AddAsync(courseStudent);
            await dbContext.SaveChangesAsync();


            // add progress reports for student 
            var result = await studentProgressReportService.AddStudentProgressReportsForNewStudent(details.courseId, details.studentNumber);
            if (result.errorMessage.Length > 0)
            {
                throw new Exception("Failed to add student progress reports");
            }

            if (student.Grade > 0)
            {
                // add course remark record for student report 
                result = await studentReportService.AddPrimaryCourseRemarkForLatestReport(details.studentNumber, details.courseId);
                if (result.errorMessage.Length > 0)
                {
                    throw new Exception("Failed to add course remark record for student");
                }
            }

            // add to moodle
            if (addToMoodle)
            {
                result = await moodleService.EnrolInCourseByUsername(student.StudentNumber, course.MoodleId, (int)MoodleCourseRoles.STUDENT);
                if (result.errorMessage != "")
                {
                    return new Response { errorMessage = "Failed to enrol user in moodle course: " + result.errorMessage, data = 500 };
                }
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    /*----  DELETE COURSE STUDENT   ----*/
    public async Task<Response> DeleteStudent(string courseId, string studentNumber, bool enrolOnMoodle)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var courseStudent = await dbContext.CourseStudents.Where(cs => cs.CourseId == courseId && cs.StudentNumber == studentNumber).FirstOrDefaultAsync();
            if (courseStudent is null)
            {
                return new Response { errorMessage = "Record not found", data = 404 };
            }

            var course = await dbContext.Courses.FirstAsync(c => c.Id == courseId);

            dbContext.CourseStudents.Remove(courseStudent);
            await dbContext.SaveChangesAsync();

            // delete student progress reports for course
            var result = await studentProgressReportService.DeleteStudentProgressReportsForCourse(courseId, studentNumber);
            if (result.errorMessage.Length > 0)
            {
                throw new Exception(result.errorMessage);
            }

            // unenrol on moodle
            if (enrolOnMoodle)
            {
                result = await moodleService.UnenrolFromCourseByUsername(studentNumber, course.MoodleId);
                if (result.errorMessage != "")
                {
                    return new Response { errorMessage = "Failed to unenrol user from moodle course: " + result.errorMessage, data = 500 };
                }
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    /*----  DELETE COURSE STAFF   ----*/
    public async Task<Response> DeleteStaff(string courseId, int staffId, bool unenrolOnMoodle)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var courseStaff = await dbContext.CourseStaffs.Where(cs => cs.CourseId == courseId && cs.StaffId == staffId).FirstOrDefaultAsync();
            if (courseStaff is null)
            {
                return new Response { errorMessage = "Record not found", data = 404 };
            }

            var course = await dbContext.Courses.FirstAsync(c => c.Id == courseId);
            var staff = await dbContext.UserAccounts.FirstAsync(u => u.UserId == staffId);

            dbContext.CourseStaffs.Remove(courseStaff);
            await dbContext.SaveChangesAsync();

            // unenrol on moodle
            if (unenrolOnMoodle)
            {
                var result = await moodleService.UnenrolFromCourseByUsername(staff.Email, course.MoodleId);
                if (result.errorMessage != "")
                {
                    return new Response { errorMessage = "Failed to unenrol user from moodle course: " + result.errorMessage, data = 500 };
                }
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    #endregion

}