
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using SCA_ITS_back_end.Models;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_1")]
public class CourseTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string coursesToken;
    private string invalidToken;

    public CourseTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
    {
        client = factory.CreateDefaultClient();
        client.Timeout = TimeSpan.FromSeconds(600);

        _testOutputHelper = testOutputHelper;

        IConfigurationBuilder builder = new ConfigurationBuilder();
        builder.AddJsonFile("appsettings.Development.json", false, true);
        config = builder.Build();

        JwtHandler jwtHandler = new JwtHandler(config);
        adminToken = jwtHandler.generate(4, 1);
        parentToken = jwtHandler.generate(2, 2);
        coursesToken = jwtHandler.generate(3, 3);
        invalidToken = jwtHandler.generate(10000000, 1);
    }

    #region Add Courses

    //----   ADD COURSE VALID   ----
    [Fact]
    public async Task Post_AddCourseValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddEditCourseRequest()
        {
            courseId = "MATH3",
            categoryId = 2,

            name = "Mathematics for grade 3",
            grade = 3,

            typeId = 1,
            isPromotional = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/", content);
        _testOutputHelper.WriteLine(response.ToString());

        var json = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(json);

        if (!response.IsSuccessStatusCode)
        {
            Assert.True(json.Contains("Failed to create moodle course"));
            return;
        }

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD COURSES INVALID, CANT ADD TO DEFAULT CATEGORY   ----
    [Fact]
    public async Task Post_AddCoursesInvalid_CantAddToDefaultCategory()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddEditCourseRequest()
        {
            courseId = "MATH4000000",
            categoryId = 1,

            name = "Mathematics for grade 3",
            grade = 3,

            typeId = 1,
            isPromotional = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD COURSES INVALID, ALREADY EXISTS   ----
    [Fact]
    public async Task Post_AddCourseInvalid_AlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddEditCourseRequest()
        {
            courseId = "MATH4",
            categoryId = 2,

            name = "Mathematics for grade 3",
            grade = 3,

            typeId = 1,
            isPromotional = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD COURSES INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task Post_AddCourseInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddEditCourseRequest()
        {
            courseId = "",
            categoryId = 2,

            name = "",
            grade = 3,

            typeId = 1,
            isPromotional = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD COURSES INVALID, NOT AN ADMIN TOKEN   ----
    [Fact]
    public async Task Post_AddCourseInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddEditCourseRequest()
        {
            courseId = "MATH5",
            categoryId = 2,

            name = "Mathematics for grade 3",
            grade = 3,

            typeId = 1,
            isPromotional = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion

    #region Get

    //----   GET ALL COURSE TYPES VALID   ----
    [Fact]
    public async Task GetAllCourseTypesValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/courses/course-types/all");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET COURSE VALID   ----
    [Fact]
    public async Task GetCourseValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/courses/MATH4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET COURSES INVALID, COURSE NOT FOUND   ----
    [Fact]
    public async Task GetCourseInvalid_CourseNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/courses/MATH100");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET COURSE INVALID, NOT AUTHORIZED   ----
    [Fact]
    public async Task GetCourseInvalid_NotAuthorized()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/courses/MATH4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }



    //----   GET ALL COURSES VALID   ----
    [Fact]
    public async Task GetAllCoursesValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/courses/all");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL COURSES INVALID, NOT AN ADMIN TOKEN   ----
    [Fact]
    public async Task GetAllCoursesInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/courses/all");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET ALL COURSES FOR STAFF VALID   ----
    [Fact]
    public async Task GetAllCoursesForStaffValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/courses/all/staff/3");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL COURSES FOR STAFF INVALID   ----
    [Fact]
    public async Task GetAllCoursesForStaffInvalid_NotAnAdminOrStaffToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/courses/all/staff/3");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET ALL COURSES FOR STUDENT VALID   ----
    [Fact]
    public async Task GetAllCoursesForStudentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/courses/all/students/220038627");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL COURSE STAFF VALID   ----
    [Fact]
    public async Task GetAllCourseStaffValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/courses/staff/MATH4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL COURSE STAFF INVALID, NOT AN ADMIN TOKEN   ----
    [Fact]
    public async Task GetAllCourseStaffInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/courses/staff/MATH4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion

    //----   ADD COURSE STAFF VALID   ----
    [Fact]
    public async Task Post_AddCourseStaffValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseStaff()
        {
            courseId = "MATH4",
            staffId = 3
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/staff", content);
        _testOutputHelper.WriteLine(response.ToString());

        var json = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(json);

        if (!response.IsSuccessStatusCode)
        {
            Assert.True(json.Contains("Failed to enrol user in moodle course"));
            return;
        }

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD COURSE STAFF INVALID, COURSE NOT FOUND   ----
    [Fact]
    public async Task Post_AddCourseStaffInvalid_CourseNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseStaff()
        {
            courseId = "MATH2000",
            staffId = 3
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/staff", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD COURSE STAFF INVALID, STAFF NOT FOUND   ----
    [Fact]
    public async Task Post_AddCourseStaffInvalid_StaffNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseStaff()
        {
            courseId = "MATH4",
            staffId = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/staff", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD COURSE STAFF INVALID, ALREADY EXISTS   ----
    [Fact]
    public async Task Post_AddCourseStaffInvalid_AlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseStaff()
        {
            courseId = "MATH4",
            staffId = 6
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/staff", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   DELETE COURSE STAFF VALID   ----
    [Fact]
    public async Task Post_DeleteCourseStaffValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/courses/staff/delete?courseId=MATH7&staffId=6");
        _testOutputHelper.WriteLine(response.ToString());

        var json = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(json);

        if (!response.IsSuccessStatusCode)
        {
            Assert.True(json.Contains("Failed to unenrol user from moodle course"));
            return;
        }

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE COURSE STAFF INVALID, NOT FOUND   ----
    [Fact]
    public async Task Post_DeleteCourseStaffInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/courses/staff/delete?courseId=MATH7000&staffId=6");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }


    //----   GET ALL COURSE STUDENTS VALID   ----
    [Fact]
    public async Task GetAllCourseStudentsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/courses/students/MATH4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL COURSE STUDENTS INVALID, NOT AN ADMIN OR STAFF TOKEN   ----
    [Fact]
    public async Task GetAllCourseStudentsInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/courses/students/MATH4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   ADD COURSE STUDENT VALID   ----
    [Fact]
    public async Task Post_AddCourseStudentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseStudent()
        {
            courseId = "MATH4",
            studentNumber = "220038627"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/students", content);
        _testOutputHelper.WriteLine(response.ToString());

        var json = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(json);

        if (!response.IsSuccessStatusCode)
        {
            Assert.True(json.Contains("Failed to enrol user in moodle course"));
            return;
        }

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD COURSE STUDENTS INVALID, COURSE NOT FOUND   ----
    [Fact]
    public async Task Post_AddCourseStudentInvalid_CourseNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseStudent()
        {
            courseId = "MATH4000",
            studentNumber = "220038627"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/students", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD COURSE STUDENTS INVALID, STUDENT NOT FOUND   ----
    [Fact]
    public async Task Post_AddCourseStudentInvalid_StudentsNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseStudent()
        {
            courseId = "MATH4",
            studentNumber = "220038627000000"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/students", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD COURSE STUDENTS INVALID, ALREADY EXISTS   ----
    [Fact]
    public async Task Post_AddCourseStudentInvalid_AlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseStudent()
        {
            courseId = "MATH4",
            studentNumber = "220038628"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/students", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   DELETE COURSE STUDENT VALID   ----
    [Fact]
    public async Task Post_DeleteCourseStudentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/courses/students/delete?courseId=MATH7&studentNumber=220038627");
        _testOutputHelper.WriteLine(response.ToString());

        var json = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(json);

        if (!response.IsSuccessStatusCode)
        {
            Assert.True(json.Contains("Failed to unenrol user from moodle course"));
            return;
        }

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE COURSE STUDENT INVALID, NOT FOUND   ----
    [Fact]
    public async Task Post_DeleteCourseStudentInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/courses/students/delete?courseId=MATH7000&studentNumber=220038");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }


}
