using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Utilities;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class MoodleSyncService
{
    private readonly SCA_ITSContext dbContext;
    private readonly ILogger<MoodleSyncService> logger;
    private MoodleSyncQueue moodleSyncQueue;
    private StudentService studentService;
    private StaffService staffService;
    private UserService userService;
    private CoursesService coursesService;
    private CourseCategoriesService courseCategoriesService;
    private MoodleService moodleService;

    public MoodleSyncService(SCA_ITSContext dbContext, MoodleSyncQueue moodleSyncQueue, StudentService studentService, StaffService staffService, CoursesService coursesService, UserService userService, CourseCategoriesService courseCategoriesService, MoodleService moodleService, ILogger<MoodleSyncService> logger)
    {
        this.dbContext = dbContext;
        this.logger = logger;
        this.moodleSyncQueue = moodleSyncQueue;
        this.studentService = studentService;
        this.staffService = staffService;
        this.coursesService = coursesService;
        this.userService = userService;
        this.courseCategoriesService = courseCategoriesService;
        this.moodleService = moodleService;
    }

    #region User sync
    /*----  SYNC CREATED USER   ----*/
    public async Task<Response> SyncCreatedUser(SyncUserCreatedUpdatedRequest details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            // if email and username are the same, its a staff member. Otherwise its a student
            if (details.email.ToLower().Equals(details.username.ToLower()))
            {
                var result = await staffService.Add(new AddStaffRequest
                {
                    email = details.email,
                    password = "ITS@1234",
                    firstName = details.firstname,
                    lastName = details.lastname,
                }, false);
                if (result.errorMessage != "")
                    return result;
            }
            else
            {
                var result = await studentService.AddDirectWithStudentNumber(new AddStudentRequest
                {
                    parentId = 2,       // the first parent in the database is always used as a general parent when no others exist or make sense
                    dob = "2022-01-01",
                    firstName = details.firstname,
                    lastName = details.lastname,
                    grade = 1
                }, details.username);
                if (result.errorMessage != "")
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

    /*----  SYNC UPDATED USER   ----*/
    public async Task<Response> SyncUpdatedUser(SyncUserCreatedUpdatedRequest details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            // if email and username are the same, its a staff member. Otherwise its a student
            if (details.email.ToLower().Equals(details.username.ToLower()))
            {
                var result = await userService.Edit(new UserUpdateRequest
                {
                    email = details.email,
                    firstName = details.firstname,
                    lastName = details.lastname,
                }, false);
                if (result.errorMessage != "")
                    return result;
            }
            else
            {
                var result = await studentService.Edit(new EditStudentRequest
                {
                    studentNumber = details.username,
                    firstName = details.firstname,
                    lastName = details.lastname,
                }, false);
                if (result.errorMessage != "")
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

    /*----  SYNC DELETED USER   ----*/
    public async Task<Response> SyncDeletedUser(SyncUserDeletedRequest details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            // if email and username are the same, its a staff member. Otherwise its a student
            if (details.email.ToLower().Equals(details.username.ToLower()))
            {
                var result = await userService.DeleteByEmail(details.email, false);
                if (result.errorMessage != "")
                    return result;
            }
            else
            {
                var result = await studentService.Delete(details.username, false);
                if (result.errorMessage != "")
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
    #endregion

    #region CourseCategory sync
    /*----  SYNC CREATED COURSE CATEGORY   ----*/
    public async Task<Response> SyncCreatedCourseCategory(SyncCourseCategoryCreatedUpdatedRequest details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            var result = await courseCategoriesService.Add(new AddCourseCategory
            {
                name = details.name,
                description = details.description,
                parentCategoryId = details.parent
            }, false, (int)details.id);
            if (result.errorMessage != "")
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

    /*----  SYNC UPDATED COURSE CATEGORY   ----*/
    public async Task<Response> SyncUpdatedCourseCategory(SyncCourseCategoryCreatedUpdatedRequest details)
    {
        try
        {
            var result = await courseCategoriesService.Edit(new UpdateCourseCategory
            {
                id = details.id,
                name = details.name,
                description = details.description,
                parentCategoryId = details.parent
            }, false);
            if (result.errorMessage != "")
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

    /*----  SYNC DELETED COURSE CATEGORY   ----*/
    public async Task<Response> SyncDeletedCourseCategory(SyncCourseCategoryDeletedRequest details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            /*
            *   If all in category is deleted, they will have their own delete requests.
            *   Only delete this one category and dont touch any of its children.
            *   
            *   Passing 0 so that sub-categories wont be moved and so that 
            *   courses will be moved to Default_Category to await their updates or deletes  
            */
            var result = await courseCategoriesService.Delete(new DeleteCourseCategory
            {
                moodleId = details.id,
                deleteRecursively = 0,
                newParentId = 0
            }, false);
            if (result.errorMessage != "")
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
    #endregion

    #region Course sync
    /*----  SYNC CREATED COURSE    ----*/
    public async Task<Response> SyncCreatedCourse(SyncCourseCreatedUpdatedRequest details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            var result = await coursesService.Add(new AddEditCourseRequest
            {
                courseId = details.shortname,
                name = details.fullname,
                categoryId = details.category,

                /*
                    grade will default to 0, the course will be non promotional, and it will be a core course.
                    The admin will have to edit these values later.
                */
                grade = 0,
                isPromotional = 0,
                typeId = 1
            }, false, (int)details.id);
            if (result.errorMessage != "")
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

    /*----  SYNC UPDATED COURSE    ----*/
    public async Task<Response> SyncUpdatedCourse(SyncCourseCreatedUpdatedRequest details)
    {
        try
        {
            if (details.id is null)
                return new Response { errorMessage = "id is null", data = 400 };

            var course = await dbContext.Courses.FirstOrDefaultAsync(c => c.MoodleId == details.id);
            if (course is null)
                return new Response { errorMessage = "Course not found", data = 404 };

            var result = await coursesService.Edit(new AddEditCourseRequest
            {
                courseId = course.Id,
                name = details.fullname,
                categoryId = details.category
            }, false);
            if (result.errorMessage != "")
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

    /*----  SYNC DELETED COURSE    ----*/
    public async Task<Response> SyncDeletedCourse(SyncCourseDeletedRequest details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            var course = await dbContext.Courses.FirstOrDefaultAsync(c => c.MoodleId == details.id);
            if (course is null)
                return new Response { errorMessage = "Course not found", data = 404 };

            var result = await coursesService.Delete(course.Id, false);
            if (result.errorMessage != "")
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
    #endregion

    #region Moodle data sync

    /// <summary>
    ///     Gets all users, course categories, and courses from moodle and syncs 
    ///     them locally. A task on a queue will be created and executed later. This
    ///     prevents the method from blocking since it will be called from an api endpoint.
    /// </summary>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> SyncAllEnqueue()
    {
        try
        {
            moodleSyncQueue.Enqueue(SYNC_TYPE.SYNC_ALL_DATA_FROM_MOODLE);
            return new Response { errorMessage = "", data = "" };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = ex.Message, data = 500 };
        }
    }

    /// <summary>
    ///     Creates a task on a queue that will retrieves all users, course categories,
    ///     courses, and users enrolled in courses from moodle and syncs it with the local data.
    /// </summary>
    /// <returns>A value task object</returns>
    public async Task SyncAll()
    {
        try
        {
            // sync all users
            var result = await SyncAllUsers();
            if (result.errorMessage != "")
                logger.LogError(result.errorMessage);

            // sync all course categories
            result = await SyncAllCourseCategories();
            if (result.errorMessage != "")
                logger.LogError(result.errorMessage);

            // sync all courses
            result = await SyncAllCourses();
            if (result.errorMessage != "")
                logger.LogError(result.errorMessage);

            // sync all enrollments
            result = await SyncAllCourseEnrollements();
            if (result.errorMessage != "")
                logger.LogError(result.errorMessage);

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
        }
    }

    /// <summary>
    ///     Syncs all moodle users locally
    /// </summary>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    private async Task<Response> SyncAllUsers()
    {
        try
        {
            string errorMessages = "";

            var result = await moodleService.GetUsers(new MoodleGetUsersRequest { email = "%" });
            if (result.errorMessage != "")
                return result;
            var users = ((List<MoodleUser>)result.data);

            for (int i = 0; i < users.Count; i++)
            {
                var user = users[i];

                // skip admin user
                if (user.firstname.ToLower().Contains("admin") || user.lastname.ToLower().Contains("admin") || user.email.ToLower().Contains("admin"))
                    continue;

                // staff member
                if (user.email.ToLower() == user.username.ToLower())
                {
                    var staff = await dbContext.UserAccounts.FirstOrDefaultAsync(u => u.Email == user.email && u.UserTypeId == 3);

                    // add new
                    if (staff is null)
                    {
                        result = await staffService.Add(new AddStaffRequest
                        {
                            email = user.email,
                            firstName = user.firstname,
                            lastName = user.lastname,
                            password = "Sca@1234"
                        }, false);
                        if (result.errorMessage != "")
                            errorMessages += $"\n{result.errorMessage}";

                        continue;
                    }

                    // edit
                    result = await userService.Edit(new UserUpdateRequest
                    {
                        email = user.email,
                        firstName = user.firstname,
                        lastName = user.lastname
                    }, false);
                    if (result.errorMessage != "")
                        errorMessages += $"\n{result.errorMessage}";
                }
                // student
                else
                {

                    // skip if username is not a number
                    int temp;
                    if (!user.username.All(Char.IsDigit))
                        continue;

                    var student = await dbContext.Students.FirstOrDefaultAsync(s => s.StudentNumber == user.username);
                    var parent = await dbContext.UserAccounts.FirstOrDefaultAsync(p => p.Email == user.email && p.UserTypeId == 2);

                    // add new
                    if (student is null)
                    {
                        result = await studentService.AddDirectWithStudentNumber(new AddStudentRequest
                        {
                            dob = "2022-12-12",
                            firstName = user.firstname,
                            lastName = user.lastname,
                            grade = 0,
                            parentId = parent is null ? 2 : parent.UserId
                        }, user.username);
                        if (result.errorMessage != "")
                            errorMessages += $"\n{result.errorMessage}";

                        continue;
                    }

                    // edit
                    result = await studentService.Edit(new EditStudentRequest
                    {
                        studentNumber = student.StudentNumber,
                        firstName = user.firstname,
                        lastName = user.lastname,
                    }, false);
                    if (result.errorMessage != "")
                        errorMessages += $"\n{result.errorMessage}";
                }
            }

            return new Response { errorMessage = errorMessages, data = 0 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = ex.Message, data = 500 };
        }
    }

    /// <summary>
    ///     Syncs all moodle course categories locally
    /// </summary>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    private async Task<Response> SyncAllCourseCategories()
    {
        try
        {
            string errorMessages = "";

            var result = await moodleService.GetCourseCategories(new MoodleGetCourseCategoriesRequest { });
            if (result.errorMessage != "")
                return result;
            var categories = (List<MoodleCourseCategory>)result.data;

            for (int i = 0; i < categories.Count; i++)
            {
                var category = categories[i];

                var existingCategory = await dbContext.CourseCategories.FirstOrDefaultAsync(c => c.MoodleId == category.id);

                // create new
                if (existingCategory is null)
                {
                    result = await courseCategoriesService.Add(new AddCourseCategory
                    {
                        name = category.name,
                        description = String.IsNullOrEmpty(category.description) ? "Empty" : category.description,
                        parentCategoryId = category.parent
                    }, false, category.id);
                    if (result.errorMessage != "")
                        errorMessages += $"\n{result.errorMessage}";

                    continue;
                }

                // edit existing
                result = await courseCategoriesService.Edit(new UpdateCourseCategory
                {
                    id = category.id,
                    name = category.name,
                    description = String.IsNullOrEmpty(category.description) ? "Empty" : category.description,
                    parentCategoryId = category.parent
                }, false);
                if (result.errorMessage != "")
                    errorMessages += $"\n{result.errorMessage}";
            }

            return new Response { errorMessage = errorMessages, data = 0 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = ex.Message, data = 500 };
        }
    }

    /// <summary>
    ///     Syncs all moodle courses locally
    /// </summary>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    private async Task<Response> SyncAllCourses()
    {
        try
        {
            string errorMessages = "";

            var result = await moodleService.GetCourses(new MoodleGetCourseRequests { });
            if (result.errorMessage != "")
                return result;
            var courses = (List<MoodleCourse>)result.data;

            for (int i = 0; i < courses.Count; i++)
            {
                var course = courses[i];

                // if course id is 1, skip.  This is a default course on moodle not used for learning
                if (course.id == 1)
                    continue;

                var existingCourse = await dbContext.Courses.FirstOrDefaultAsync(c => c.MoodleId == course.id);

                // create new
                if (existingCourse is null)
                {
                    // try to get grade from full name of course
                    var grade = 0;
                    Int32.TryParse(course.fullname.Substring(course.fullname.Length - 1), out grade);

                    result = await coursesService.Add(new AddEditCourseRequest
                    {
                        courseId = course.shortname,
                        categoryId = course.categoryid,
                        name = course.fullname,
                        grade = grade,

                        isPromotional = 1,
                        typeId = 1              // make it core for now
                    }, false, course.id);
                    if (result.errorMessage != "")
                        errorMessages += $"\n{result.errorMessage}";

                    continue;
                }

                // edit existing
                result = await coursesService.Edit(new AddEditCourseRequest
                {
                    courseId = course.shortname,
                    categoryId = course.categoryid,
                    name = course.fullname,
                }, false);
                if (result.errorMessage != "")
                    errorMessages += $"\n{result.errorMessage}";
            }

            return new Response { errorMessage = errorMessages, data = 0 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = ex.Message, data = 500 };
        }
    }

    /// <summary>
    ///     Syncs all moodle course enrollements locally
    /// </summary>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    private async Task<Response> SyncAllCourseEnrollements()
    {
        try
        {
            string errorMessages = "";

            var courses = await dbContext.Courses.ToListAsync();

            for (int i = 0; i < courses.Count; i++)
            {
                var course = courses[i];

                // get existing course staff and students
                var courseStaff = await dbContext.CourseStaffs.Where(cs => cs.CourseId == course.Id).ToListAsync();
                var staff = await dbContext.UserAccounts.Where(u => u.UserTypeId == 3).ToListAsync();
                var courseStudents = await dbContext.CourseStudents.Where(cs => cs.CourseId == course.Id).ToListAsync();

                // get enrolled moodle users
                var result = await moodleService.GetEnrolledInCourse(new MoodleGetEnrollementsRequest { courseid = course.MoodleId });
                if (result.errorMessage != "")
                {
                    errorMessages += $"\n{result.errorMessage}";
                    continue;
                }
                var users = (List<MoodleUser>)result.data;

                // 1. remove current users not found in moodle enrolled users
                foreach (var cs in courseStaff)
                {
                    var staffMember = staff.First(s => s.UserId == cs.StaffId);
                    if (!users.Any(u => u.username == staffMember.Email))
                    {
                        result = await coursesService.DeleteStaff(cs.CourseId, cs.StaffId, false);
                        if (result.errorMessage != "")
                            errorMessages += $"\n{result.errorMessage}";
                    }

                }
                foreach (var cs in courseStudents)
                {
                    if (!users.Any(u => u.username == cs.StudentNumber))
                    {
                        result = await coursesService.DeleteStudent(cs.CourseId, cs.StudentNumber, false);
                        if (result.errorMessage != "")
                            errorMessages += $"\n{result.errorMessage}";
                    }
                }

                // 2. add users not enrolled
                foreach (var user in users)
                {
                    // staff
                    if (user.username.ToLower() == user.email.ToLower())
                    {
                        var staffMember = staff.FirstOrDefault(s => s.Email == user.email);
                        if (staffMember is null)
                        {
                            errorMessages += $"\nStaff member not found!";
                            continue;
                        }
                        if (courseStaff.Any(cs => cs.StaffId == staffMember.UserId))
                            continue;

                        result = await coursesService.AddStaff(new AddCourseStaff { courseId = course.Id, staffId = staffMember.UserId }, false);
                        if (result.errorMessage != "")
                            errorMessages += $"\n{result.errorMessage}";
                    }
                    // student
                    else
                    {
                        if (courseStudents.Any(cs => cs.StudentNumber == user.username))
                            continue;

                        result = await coursesService.AddStudent(new AddCourseStudent { courseId = course.Id, studentNumber = user.username }, false);
                        if (result.errorMessage != "")
                            errorMessages += $"\n{result.errorMessage}";
                    }
                }
            }

            return new Response { errorMessage = errorMessages, data = 0 };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = ex.Message, data = 500 };
        }
    }

    #endregion

    #region ITS data sync

    /// <summary>
    ///     Adds item to queue signaling syncing of ITS users with moodle.
    /// </summary>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> SyncAllITSUsersEnqueue()
    {
        try
        {
            moodleSyncQueue.Enqueue(SYNC_TYPE.SYNC_ALL_ITS_USERS_WITH_MOODLE);
            return new Response { errorMessage = "", data = "" };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = ex.Message, data = 500 };
        }
    }

    /// <summary>
    ///     Syncs all ITS users with moodle
    /// </summary>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> SyncAllITSUsers()
    {
        try
        {
            var staff = await staffService.GetAll();
            var students = await studentService.GetAll(new StudentSearchParams { registrationStage = (int)STUDENT_REGISTRATION_STATUS.APPROVED });

            var usersToAdd = new List<MoodleAddUserRequest>();

            if (staff.errorMessage == "")
            {
                var users = (List<User>)staff.data;
                users.ForEach(u =>
                {
                    usersToAdd.Add(new MoodleAddUserRequest
                    {
                        username = u.Email,
                        email = u.Email,
                        firstname = u.FirstName,
                        lastname = u.LastName,
                        password = "Sca@1234"
                    });
                });
            }

            if (students.errorMessage == "")
            {
                var users = (List<StudentSingle>)students.data;
                users.ForEach(u =>
                {
                    usersToAdd.Add(new MoodleAddUserRequest
                    {
                        username = u.StudentNumber,
                        email = u.ParentEmail,
                        firstname = u.FirstName,
                        lastname = u.LastName,
                        password = "Sca@1234"
                    });
                });
            }

            foreach (var user in usersToAdd)
            {
                logger.LogInformation(user.email);
                var result = await moodleService.AddUser(user);
                if (result.errorMessage != "")
                    logger.LogError(result.errorMessage);
            }

            return new Response { errorMessage = "", data = "ok" };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = ex.Message, data = 500 };
        }
    }



    #endregion
}