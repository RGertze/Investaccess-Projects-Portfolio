
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;
using SCA_ITS_back_end.Services;
using Microsoft.Extensions.DependencyInjection;

namespace back_end_tests;

[Collection("GROUP_3")]
public class MoodleSyncTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    private StudentReportService studentReportService;

    public MoodleSyncTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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
        staffToken = jwtHandler.generate(3, 3);
        invalidToken = jwtHandler.generate(10000000, 1);

        var scope = factory.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
        this.studentReportService = scope.ServiceProvider.GetRequiredService<StudentReportService>();
    }


    #region USER CREATED

    //----   SYNC CREATED STAFF USER VALID   ----
    [Fact]
    public async Task SyncCreatedStaffUserValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserCreatedUpdatedRequest()
        {
            username = "em@em.com",
            email = "em@em.com",
            firstname = "j",
            lastname = "s",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   SYNC CREATED STUDENT USER VALID   ----
    [Fact]
    public async Task SyncCreatedStudentUserValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserCreatedUpdatedRequest()
        {
            username = "2200386277777",
            email = "em@em.com",
            firstname = "j",
            lastname = "s",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   SYNC CREATED STAFF USER INVALID, STAFF ALREADY EXISTS   ----
    [Fact]
    public async Task SyncCreatedStaffUserInvalid_StaffAlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserCreatedUpdatedRequest()
        {
            username = "staff@gmail.com",
            email = "staff@gmail.com",
            firstname = "j",
            lastname = "s",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   SYNC CREATED STUDENT USER INVALID, STUDENT ALREADY EXISTS   ----
    [Fact]
    public async Task SyncCreatedStudentUserInvalid_StudentAlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserCreatedUpdatedRequest()
        {
            username = "220038627",
            email = "staff@gmail.com",
            firstname = "j",
            lastname = "s",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   SYNC CREATED USER INVALID, INVALID TOKEN   ----
    [Fact]
    public async Task SyncCreatedStudentUserInvalid_InvalidToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserCreatedUpdatedRequest()
        {
            username = "220038627999999",
            email = "staff@gmail.com",
            firstname = "j",
            lastname = "s",
            token = "definitely not valid",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   SYNC CREATED USER INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task SyncCreatedUserInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserCreatedUpdatedRequest()
        {
            username = "",
            email = "",
            firstname = "",
            lastname = "",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }
    #endregion

    #region USER UPDATED
    //----   SYNC UPDATED STAFF USER VALID   ----
    [Fact]
    public async Task SyncUpdatedStaffUserValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserCreatedUpdatedRequest()
        {
            username = "staff@gmail.com",
            email = "staff@gmail.com",
            firstname = "j",
            lastname = "s",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/updated", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   SYNC UPDATED STUDENT USER VALID   ----
    [Fact]
    public async Task SyncUpdatedStudentUserValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserCreatedUpdatedRequest()
        {
            username = "220038627",
            email = "em@em.com",
            firstname = "j",
            lastname = "s",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/updated", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   SYNC UPDATED STAFF USER INVALID, NOT FOUND   ----
    [Fact]
    public async Task SyncUpdatedStaffUserInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserCreatedUpdatedRequest()
        {
            username = "staff000000@gmail.com",
            email = "staff000000@gmail.com",
            firstname = "j",
            lastname = "s",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/updated", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   SYNC UPDATED STUDENT USER INVALID, NOT FOUND   ----
    [Fact]
    public async Task SyncUpdatedStudentUserInvalid_StudentAlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserCreatedUpdatedRequest()
        {
            username = "22003862799999",
            email = "staff@gmail.com",
            firstname = "j",
            lastname = "s",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/updated", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   SYNC UPDATED USER INVALID, INVALID TOKEN   ----
    [Fact]
    public async Task SyncUpdatedStudentUserInvalid_InvalidToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserCreatedUpdatedRequest()
        {
            username = "220038627999999",
            email = "staff@gmail.com",
            firstname = "j",
            lastname = "s",
            token = "definitely not valid",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/updated", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion

    #region USER DELETED

    //----   SYNC DELETED STAFF USER VALID   ----
    [Fact]
    public async Task SyncDeletedStaffUserValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserDeletedRequest()
        {
            username = "staff2@gmail.com",
            email = "staff2@gmail.com",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   SYNC DELETED STUDENT USER VALID   ----
    [Fact]
    public async Task SyncDeletedStudentUserValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserDeletedRequest()
        {
            username = "1234",
            email = "em@em.com",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   SYNC DELETED STAFF USER INVALID, NOT FOUND   ----
    [Fact]
    public async Task SyncDeletedStaffUserInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserDeletedRequest()
        {
            username = "staff9999999@gmail.com",
            email = "staff9999999@gmail.com",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   SYNC DELETED STUDENT USER INVALID, NOT FOUND   ----
    [Fact]
    public async Task SyncDeletedStudentUserInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserDeletedRequest()
        {
            username = "2200386270000000",
            email = "staff@gmail.com",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   SYNC DELETED USER INVALID, INVALID TOKEN   ----
    [Fact]
    public async Task SyncDeletedStudentUserInvalid_InvalidToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserDeletedRequest()
        {
            username = "220038627999999",
            email = "staff@gmail.com",
            token = "definitely not valid",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   SYNC DELETED USER INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task SyncDeletedUserInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncUserDeletedRequest()
        {
            username = "",
            email = "",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/users/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    #endregion

    #region CATEGORY CREATED

    //----   SYNC CREATED CATEGORY VALID   ----
    [Fact]
    public async Task SyncCreatedCategoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCategoryCreatedUpdatedRequest()
        {
            id = 123,
            name = "n",
            description = "desc",
            parent = 0,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/categories/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   SYNC CREATED  CATEGORY INVALID,  ALREADY EXISTS   ----
    [Fact]
    public async Task SyncCreatedCategoryInvalid_AlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCategoryCreatedUpdatedRequest()
        {
            id = 1,
            name = "n",
            description = "desc",
            parent = 0,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/categories/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   SYNC CREATED CATEGORY INVALID, INVALID TOKEN   ----
    [Fact]
    public async Task SyncCreatedCategoryInvalid_InvalidToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCategoryCreatedUpdatedRequest()
        {
            id = 123,
            name = "n",
            description = "desc",
            parent = 0,
            token = "definitely not valid",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/categories/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   SYNC CREATED CATEGORY INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task SyncCreatedCategoryInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCategoryCreatedUpdatedRequest()
        {
            id = 125,
            name = "",
            description = "",
            parent = 0,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/categories/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }
    #endregion

    #region CATEGORY UPDATED

    //----   SYNC UPDATED  CATEGORY VALID   ----
    [Fact]
    public async Task SyncUpdatedCategoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCategoryCreatedUpdatedRequest()
        {
            id = 2,
            name = "new name",
            description = "idk",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/categories/updated", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   SYNC UPDATED  CATEGORY INVALID, NOT FOUND   ----
    [Fact]
    public async Task SyncUpdatedCategoryInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCategoryCreatedUpdatedRequest()
        {
            id = 2000,
            name = "new name",
            description = "idk",
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/categories/updated", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   SYNC UPDATED CATEGORY INVALID, INVALID TOKEN   ----
    [Fact]
    public async Task SyncUpdatedCategoryInvalid_InvalidToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCategoryCreatedUpdatedRequest()
        {
            id = 123,
            name = "n",
            description = "desc",
            parent = 0,
            token = "definitely not valid",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/categories/updated", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion

    #region CATEGORY DELETED

    //----   SYNC DELETED  CATEGORY VALID   ----
    [Fact]
    public async Task SyncDeletedCategoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCategoryDeletedRequest()
        {
            id = 3,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/categories/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   SYNC DELETED  CATEGORY INVALID, NOT FOUND   ----
    [Fact]
    public async Task SyncDeletedCategoryInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCategoryDeletedRequest()
        {
            id = 30000,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/categories/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   SYNC DELETED CATEGORY INVALID, INVALID TOKEN   ----
    [Fact]
    public async Task SyncDeletedCategoryInvalid_InvalidToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCategoryDeletedRequest()
        {
            id = 30000,
            token = "no beuno",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/categories/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   SYNC DELETED CATEGORY INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task SyncDeletedCategoryInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCategoryDeletedRequest()
        {
            id = null,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/categories/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    #endregion

    #region COURSE CREATED

    //----   SYNC CREATED COURSE VALID   ----
    [Fact]
    public async Task SyncCreatedCourseValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCreatedUpdatedRequest()
        {
            id = 444,
            shortname = "NEW",
            fullname = "COURSE",
            category = 2,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/courses/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   SYNC CREATED COURSE INVALID, COURSE WITH MOODLE ID ALREADY EXISTS   ----
    [Fact]
    public async Task SyncCreatedCourseInvalid_AlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCreatedUpdatedRequest()
        {
            id = 1,
            shortname = "MATH44444",
            fullname = "COURSE",
            category = 1,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/courses/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   SYNC CREATED COURSE INVALID, COURSE WITH NAME ALREADY EXISTS   ----
    [Fact]
    public async Task SyncCreatedCourseInvalid_CourseWithNameAlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCreatedUpdatedRequest()
        {
            id = 1000,
            shortname = "MATH4",
            fullname = "COURSE",
            category = 1,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/courses/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   SYNC CREATED COURSE INVALID, INVALID TOKEN   ----
    [Fact]
    public async Task SyncCreatedCourseInvalid_InvalidToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCreatedUpdatedRequest()
        {
            id = 1000,
            shortname = "MATH4",
            fullname = "COURSE",
            category = 1,
            token = "definitely not valid",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/courses/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   SYNC CREATED COURSE INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task SyncCreatedCourseInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCreatedUpdatedRequest()
        {
            id = null,
            shortname = "",
            fullname = "",
            category = 1,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/courses/created", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }
    #endregion

    #region COURSE UPDATED

    //----   SYNC UPDATED  COURSE VALID   ----
    [Fact]
    public async Task SyncUpdatedCourseValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCreatedUpdatedRequest()
        {
            id = 1,
            shortname = "MATH4",
            fullname = "A MATH COURSE",
            category = 1,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/courses/updated", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   SYNC UPDATED  COURSE INVALID, NOT FOUND   ----
    [Fact]
    public async Task SyncUpdatedCourseInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCreatedUpdatedRequest()
        {
            id = 19999,
            shortname = "MATH4",
            fullname = "A MATH COURSE",
            category = 1,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/courses/updated", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   SYNC UPDATED COURSE INVALID, INVALID TOKEN   ----
    [Fact]
    public async Task SyncUpdatedCourseInvalid_InvalidToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseCreatedUpdatedRequest()
        {
            id = 1000,
            shortname = "MATH4",
            fullname = "COURSE",
            category = 1,
            token = "definitely not valid",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/courses/updated", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion

    #region COURSE DELETED

    //----   SYNC DELETED  COURSE VALID   ----
    [Fact]
    public async Task SyncDeletedCourseValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseDeletedRequest()
        {
            id = 3,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/courses/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   SYNC DELETED  COURSE INVALID, NOT FOUND   ----
    [Fact]
    public async Task SyncDeletedCourseInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseDeletedRequest()
        {
            id = 30000,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/courses/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   SYNC DELETED COURSE INVALID, INVALID TOKEN   ----
    [Fact]
    public async Task SyncDeletedCourseInvalid_InvalidToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseDeletedRequest()
        {
            id = 30000,
            token = "no beuno",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/courses/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   SYNC DELETED COURSE INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task SyncDeletedCourseInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new SyncCourseDeletedRequest()
        {
            id = null,
            token = config["Moodle_Sync:Token"],
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/moodle-sync/courses/deleted", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    #endregion


}