
using System.Text;
using System.Text.Json;
using System.Net;
using Xunit.Abstractions;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Services;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_2")]
public class CourseCategoryTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    public CourseCategoryTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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
    }

    //----   GET ALL VALID   ----
    [Fact]
    public async Task getAllValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/course-categories");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL INVALID, NO TOKEN   ----
    [Fact]
    public async Task getAllInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/course-categories");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   ADD COURSE CATEGORY VALID, WITH PARENT CATEGORY   ----
    [Fact]
    public async Task addCourseCategoryValid_WithParentCategory()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseCategory()
        {
            name = "a name",
            description = "a desc",
            parentCategoryId = 2
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories", content);
        _testOutputHelper.WriteLine(response.ToString());

        var json = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(json);

        if (!response.IsSuccessStatusCode)
        {
            Assert.True(json.Contains("Failed to create moodle course category"));
            return;
        }

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD COURSE CATEGORY VALID, TOP LEVEL   ----
    [Fact]
    public async Task addCourseCategoryValid_TopLevel()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseCategory()
        {
            name = "a name",
            description = "a desc",
            parentCategoryId = 0
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories", content);
        _testOutputHelper.WriteLine(response.ToString());

        var json = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(json);

        if (!response.IsSuccessStatusCode)
        {
            Assert.True(json.Contains("Failed to create moodle course category"));
            return;
        }

        Assert.True(response.IsSuccessStatusCode);
    }


    //----   ADD COURSE CATEGORY INVALID, PARENT CATEGORY NOT FOUND   ----
    [Fact]
    public async Task addCourseCategoryInvalid_ParentCategoryNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseCategory()
        {
            name = "a name",
            description = "a desc",
            parentCategoryId = 10000
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD COURSE CATEGORY INVALID, CANT ADD TO DEFAULT CATEGORY   ----
    [Fact]
    public async Task AddCourseCategoryInvalid_CantAddToDefaultCategory()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseCategory()
        {
            name = "a name",
            description = "a desc",
            parentCategoryId = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD COURSE CATEGORY INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task addCourseCategoryInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseCategory()
        {
            name = "",
            description = "",
            parentCategoryId = null
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   DELETE COURSE CATEGORY VALID   ----
    [Fact]
    public async Task deleteCourseCategoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new DeleteCourseCategory()
        {
            moodleId = 3,
            newParentId = 1,
            deleteRecursively = 0
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories/delete", content);
        _testOutputHelper.WriteLine(response.ToString());

        var json = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(json);

        if (!response.IsSuccessStatusCode)
        {
            Assert.True(json.Contains("Failed to delete course category"));
            return;
        }

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE COURSE CATEGORY INVALID, CANNOT DELETE DEFAULT CATEGORY   ----
    [Fact]
    public async Task DeleteCourseCategoryInvalid_CannotDeleteDefaultCategory()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new DeleteCourseCategory()
        {
            moodleId = 1,
            newParentId = 0,
            deleteRecursively = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories/delete", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   DELETE COURSE CATEGORY INVALID, NOT FOUND   ----
    [Fact]
    public async Task deleteCourseCategoryInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new DeleteCourseCategory()
        {
            moodleId = 20000,
            newParentId = 0,
            deleteRecursively = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories/delete", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   DELETE COURSE CATEGORY INVALID, PARENT CATEGORY NOT FOUND   ----
    [Fact]
    public async Task deleteCourseCategoryInvalid_ParentCategoryNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new DeleteCourseCategory()
        {
            moodleId = 2,
            newParentId = 40000,
            deleteRecursively = 0
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories/delete", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   DELETE COURSE CATEGORY INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task deleteCourseCategoryInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new DeleteCourseCategory()
        {
            moodleId = null,
            newParentId = null,
            deleteRecursively = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories/delete", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   EDIT COURSE CATEGORY VALID   ----
    [Fact]
    public async Task editCourseCategoryValid_WithParentCategory()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateCourseCategory()
        {
            id = 4,
            name = "a name",
            description = "a desc",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        var json = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(json);

        if (!response.IsSuccessStatusCode)
        {
            Assert.True(json.Contains("Failed to update moodle course category"));
            return;
        }

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   EDIT COURSE CATEGORY INVALID, NOT FOUND   ----
    [Fact]
    public async Task editCourseCategoryInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateCourseCategory()
        {
            id = 400000000,
            name = "a name",
            description = "a desc",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT COURSE CATEGORY INVALID, EMPTY ID   ----
    [Fact]
    public async Task editCourseCategoryInvalid_EmptyId()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateCourseCategory()
        {
            id = null,
            name = "a name",
            description = "a desc",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/course-categories/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }
}