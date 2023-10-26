using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using System.Text.Json;
using System.Text.Json.Serialization;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class MoodleService
{
    #region User management function names
    private static string CREATE_USER_FUNCTION = "core_user_create_users";
    private static string UPDATE_USER_FUNCTION = "core_user_update_users";
    private static string DELETE_USER_FUNCTION = "core_user_delete_users";
    private static string GET_USERS_FUNCTION = "core_user_get_users";
    #endregion

    #region Course category management function names
    private static string GET_COURSE_CATEGORY_FUNCTION = "core_course_get_categories";
    private static string CREATE_COURSE_CATEGORY_FUNCTION = "core_course_create_categories";
    private static string DELETE_COURSE_CATEGORY_FUNCTION = "core_course_delete_categories";
    private static string UPDATE_COURSE_CATEGORY_FUNCTION = "core_course_update_categories";
    #endregion

    #region Course management function names
    private static string GET_COURSES_FUNCTION = "core_course_get_courses";
    private static string CREATE_COURSE_FUNCTION = "core_course_create_courses";
    private static string DELETE_COURSE_FUNCTION = "core_course_delete_courses";
    private static string UPDATE_COURSE_FUNCTION = "core_course_update_courses";

    private static string GET_ENROLLED_FUNCTION = "core_enrol_get_enrolled_users";
    private static string ENROL_USER_IN_COURSE_FUNCTION = "enrol_manual_enrol_users";
    private static string UNENROL_USER_FROM_COURSE_FUNCTION = "enrol_manual_unenrol_users";
    #endregion

    private string BaseUrl;
    private string token;

    private readonly SCA_ITSContext dbContext;
    private IHttpClientFactory clientFactory;
    private ILogger<MoodleService> logger;
    private IConfiguration configuration;

    public MoodleService(SCA_ITSContext dbContext, IHttpClientFactory clientFactory, ILogger<MoodleService> logger, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.clientFactory = clientFactory;
        this.logger = logger;
        this.configuration = configuration;

        this.token = configuration["Moodle:Token"];
        this.BaseUrl = configuration["Moodle:Url"];
    }

    #region User management

    /// <summary>
    ///     Get moodle users by params
    /// </summary>
    /// <param name="details">Object containing the search params</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> GetUsers(MoodleGetUsersRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(GET_USERS_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to create user: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

            var stream = await res.Content.ReadAsStreamAsync();
            var responseObj = await JsonSerializer.DeserializeAsync<MoodleGetUsersResponse>(stream);

            return new Response { errorMessage = "", data = responseObj.users };
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
    ///     Adds a new user to moodle
    /// </summary>
    /// <param name="details">Object containing the details of the user to add</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> AddUser(MoodleAddUserRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(CREATE_USER_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to create user: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

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

    /// <summary>
    ///     Adds multiple new users to moodle
    /// </summary>
    /// <param name="details">Object containing the details of the users to add</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> AddUsers(MoodleAddUsersRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(CREATE_USER_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to create users: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

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



    /// <summary>
    ///     Edit moodle user
    /// </summary>
    /// <param name="details">Object containing the details of the user to edit</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> EditUser(MoodleUpdateUserRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(UPDATE_USER_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to update user: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

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

    /// <summary>
    ///     Edit moodle user by username
    /// </summary>
    /// <param name="details">Object containing the details of the user to edit</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> EditUserByUsername(string username, MoodleUpdateUserRequest details)
    {
        try
        {
            var result = await this.GetUsers(new MoodleGetUsersRequest { username = username });
            if (result.errorMessage != "")
                return result;

            var users = (List<MoodleUser>)result.data;
            if (users.Count <= 0)
                return new Response { errorMessage = "user not found on moodle", data = 404 };

            var userToEdit = users[0];

            details.userId = userToEdit.id;

            return await this.EditUser(details);
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
    ///     Deletes a user from moodle
    /// </summary>
    /// <param name="details">Object containing the details of the user to delete</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> DeleteUser(MoodleDeleteUserRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(DELETE_USER_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to delete user: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

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

    /// <summary>
    ///     Deletes a user from moodle using their username
    /// </summary>
    /// <param name="username">username of user to delete</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> DeleteUserByUsername(string username)
    {
        try
        {
            var result = await this.GetUsers(new MoodleGetUsersRequest { username = username });
            if (result.errorMessage != "")
                return result;

            var users = (List<MoodleUser>)result.data;
            if (users.Count <= 0)
                return new Response { errorMessage = "user not found on moodle", data = 404 };

            var userToDelete = users[0];

            return await this.DeleteUser(new MoodleDeleteUserRequest { userId = userToDelete.id });
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

    #region Course category management

    /// <summary>
    ///     Get moodle course categories by params
    /// </summary>
    /// <param name="details">Object containing the search params</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> GetCourseCategories(MoodleGetCourseCategoriesRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(GET_COURSE_CATEGORY_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to get categories: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

            var stream = await res.Content.ReadAsStreamAsync();
            var categories = await JsonSerializer.DeserializeAsync<List<MoodleCourseCategory>>(stream);

            return new Response { errorMessage = "", data = categories };
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
    ///     Adds a new course category to moodle
    /// </summary>
    /// <param name="details">Object containing the details of the category to add</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> AddCourseCategory(MoodleAddCourseCategory details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(CREATE_COURSE_CATEGORY_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to create course category: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

            var stream = await res.Content.ReadAsStreamAsync();
            var responseObj = await JsonSerializer.DeserializeAsync<List<MoodleAddCourseCategoryResponse>>(stream);

            return new Response { errorMessage = "", data = responseObj[0] };
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
    ///     Updates a course category from moodle
    /// </summary>
    /// <param name="details">Object containing the details of the category to update</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> UpdateCourseCategory(MoodleUpdateCourseCategoryRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(UPDATE_COURSE_CATEGORY_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to delete course category: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

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

    /// <summary>
    ///     Deletes a course category from moodle
    /// </summary>
    /// <param name="details">Object containing the details of the category to delete</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> DeleteCourseCategory(MoodleDeleteCourseCategoryRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(DELETE_COURSE_CATEGORY_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to delete course category: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

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

    #region Course management

    /// <summary>
    ///     Get moodle courses by params
    /// </summary>
    /// <param name="details">Object containing the search params</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> GetCourses(MoodleGetCourseRequests details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(GET_COURSES_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to get courses: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

            var stream = await res.Content.ReadAsStreamAsync();
            var categories = await JsonSerializer.DeserializeAsync<List<MoodleCourse>>(stream);

            return new Response { errorMessage = "", data = categories };
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
    ///     Adds a new course to moodle
    /// </summary>
    /// <param name="details">Object containing the details of the course to add</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> AddCourse(MoodleAddCourseRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(CREATE_COURSE_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to create course: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

            var stream = await res.Content.ReadAsStreamAsync();
            var responseObj = await JsonSerializer.DeserializeAsync<List<MoodleAddCourseResponse>>(stream);

            return new Response { errorMessage = "", data = responseObj[0] };
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
    ///     Edit moodle course
    /// </summary>
    /// <param name="details">Object containing the details of the course to edit</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> EditCourse(MoodleEditCourseRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(UPDATE_COURSE_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to create course: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

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

    /// <summary>
    ///     Deletes a course from moodle
    /// </summary>
    /// <param name="details">Object containing the details of the course to delete</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> DeleteCourse(MoodleDeleteCourseRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(DELETE_COURSE_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to delete course category: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

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

    /// <summary>
    ///     Get moodle users enrolled in course
    /// </summary>
    /// <param name="details">Object containing the search params</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> GetEnrolledInCourse(MoodleGetEnrollementsRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();
            var url = details.addQueryParams(getRequestUrl(GET_ENROLLED_FUNCTION));

            var res = await client.PostAsync(url, postData);
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to get enrollements: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

            var stream = await res.Content.ReadAsStreamAsync();
            var categories = await JsonSerializer.DeserializeAsync<List<MoodleUser>>(stream);

            return new Response { errorMessage = "", data = categories };
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
    ///     Enrols a user to a moodle course
    /// </summary>
    /// <param name="details">Object containing the details of the enrolment</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> EnrolInCourse(MoodleEnrolInCourseRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(ENROL_USER_IN_COURSE_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to enrol in course: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

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

    /// <summary>
    ///     Enrols a user to a moodle course using their username
    /// </summary>
    /// <param name="username">username of user to enrol</param>
    /// <param name="courseId">id of course to enrol in</param>
    /// <param name="roleId">id of role to assign to user</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> EnrolInCourseByUsername(string username, int courseId, int roleId)
    {
        try
        {
            var result = await this.GetUsers(new MoodleGetUsersRequest { username = username });
            if (result.errorMessage != "")
                return result;

            var users = (List<MoodleUser>)result.data;
            if (users.Count <= 0)
                return new Response { errorMessage = "user not found on moodle", data = 404 };

            var userToDelete = users[0];

            return await this.EnrolInCourse(new MoodleEnrolInCourseRequest
            {
                userid = userToDelete.id,
                courseid = courseId,
                roleid = roleId
            });
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
    ///     Unenrols a user from a moodle course
    /// </summary>
    /// <param name="details">Object containing the details of the unenrolment</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> UnenrolFromCourse(MoodleUnenrolFromCourseRequest details)
    {
        try
        {
            using HttpClient client = clientFactory.CreateClient();

            var postData = details.getAsFormContent();

            var res = await client.PostAsync(getRequestUrl(UNENROL_USER_FROM_COURSE_FUNCTION), postData);
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);

            if (json.Contains("exception"))
            {
                var moodleEx = JsonSerializer.Deserialize<MoodleException>(json);
                logger.LogError("Failed to unenrol from course: " + json);
                return new Response { errorMessage = moodleEx.message, data = 500 };
            }

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

    /// <summary>
    ///     Unenrols a user from a moodle course using their username
    /// </summary>
    /// <param name="username">username of user to unenrol</param>
    /// <param name="courseId">id of course to enrol in</param>
    /// <returns>A response object with an empty errorMessage field if successful</returns>
    public async Task<Response> UnenrolFromCourseByUsername(string username, int courseId)
    {
        try
        {
            var result = await this.GetUsers(new MoodleGetUsersRequest { username = username });
            if (result.errorMessage != "")
                return result;

            var users = (List<MoodleUser>)result.data;
            if (users.Count <= 0)
                return new Response { errorMessage = "user not found on moodle", data = 404 };

            var userToDelete = users[0];

            return await this.UnenrolFromCourse(new MoodleUnenrolFromCourseRequest
            {
                userid = userToDelete.id,
                courseid = courseId,
            });
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

    private string getRequestUrl(string functionName)
    {
        return $"{BaseUrl}?wstoken={this.token}&wsfunction={functionName}&moodlewsrestformat=json";
    }
}