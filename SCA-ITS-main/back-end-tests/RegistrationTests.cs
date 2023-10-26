
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;

namespace back_end_tests;

[Collection("GROUP_2")]
public class RegistrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;

    public RegistrationTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
    {
        client = factory.CreateDefaultClient();
        client.Timeout = TimeSpan.FromSeconds(600);
        _testOutputHelper = testOutputHelper;
    }


    //----   GET PARENT REQUIRED REGISTRATION DOCUMENTS VALID   ----
    [Fact]
    public async Task GetParentRequiredRegistrationDocumentsValid()
    {
        var response = await client.GetAsync("api/registration/required-docs/parents");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET REQUIRED UPLOADED DOCUMENTS VALID   ----
    [Fact]
    public async Task GetRequiredUploadedDocumentsValid()
    {
        var response = await client.GetAsync("api/registration/parent/required-docs/uploaded?reqId=1&userId=2");
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PARENT REQUIRED UPLOADED DOCUMENTS INVALID, REQUIRED DOCUMENT DOES NOT EXIST   ----
    [Fact]
    public async Task GetParentRequiredUploadedDocumentsInvalid_RequiredDocumentDoesNotExist()
    {
        var response = await client.GetAsync("api/registration/parent/required-docs/uploaded?reqId=10000&userId=2");
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET REQUIRED PARENT UPLOADED DOCUMENTS INVALID, PARENT DOES NOT EXIST   ----
    [Fact]
    public async Task GetRequiredParentUploadedDocumentsInvalid_ParentDoesNotExist()
    {
        var response = await client.GetAsync("api/registration/parent/required-docs/uploaded?reqId=1&userId=1000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD PARENT REGISTRATION FILE VALID   ----
    [Fact]
    public async Task Post_AddParentRegistrationFileValid()
    {
        string jsonStr = JsonSerializer.Serialize(new AddParentRegistrationFileRequest()
        {
            filePath = "some-file-path-idk",
            requiredId = 1,
            userId = 2,
            name = "does it matter?"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/registration/parents/files/upload", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD PARENT REGISTRATION FILE INVALID, FILE ALREADY EXISTS   ----
    [Fact]
    public async Task Post_AddParentRegistrationFileInvalid_FileAlreadyExists()
    {
        string jsonStr = JsonSerializer.Serialize(new AddParentRegistrationFileRequest()
        {
            filePath = "some-file-path-1",
            requiredId = 1,
            userId = 2,
            name = "does it matter?"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/registration/parents/files/upload", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD PARENT REGISTRATION FILE INVALID, PARENT DOES NOT EXIST   ----
    [Fact]
    public async Task Post_AddParentRegistrationFileInvalid_ParentDoesNotExist()
    {
        string jsonStr = JsonSerializer.Serialize(new AddParentRegistrationFileRequest()
        {
            filePath = "some-file-path-ikkkkdjsnf",
            requiredId = 1,
            userId = 1,
            name = "does it matter?"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/registration/parents/files/upload", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD PARENT REGISTRATION FILE INVALID, REQUIRED DOCUMENT DOES NOT EXIST   ----
    [Fact]
    public async Task Post_AddParentRegistrationFileInvalid_RequiredDocumentDoesNotExist()
    {
        string jsonStr = JsonSerializer.Serialize(new AddParentRegistrationFileRequest()
        {
            filePath = "some-file-path-ikkk",
            requiredId = 10000,
            userId = 2,
            name = "does it matter?"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/registration/parents/files/upload", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD PARENT REGISTRATION FILE INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_AddParentRegistrationFileInvalid_BadRequest()
    {
        string jsonStr = JsonSerializer.Serialize(new AddParentRegistrationFileRequest()
        {
            filePath = "",
            requiredId = 1,
            userId = 2,
            name = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/registration/parents/files/upload", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   GET STUDENT REQUIRED REGISTRATION DOCUMENTS VALID   ----
    [Fact]
    public async Task GetStudentRequiredRegistrationDocumentsValid()
    {
        var response = await client.GetAsync("api/registration/required-docs/students");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET REQUIRED STUDENT UPLOADED DOCUMENTS VALID   ----
    [Fact]
    public async Task GetRequiredStudentUploadedDocumentsValid()
    {
        var response = await client.GetAsync("api/registration/student/required-docs/uploaded?reqId=4&studentNumber=220038627");
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET REQUIRED UPLOADED DOCUMENTS INVALID, REQUIRED DOCUMENT DOES NOT EXIST   ----
    [Fact]
    public async Task GetRequiredUploadedDocumentsInvalid_RequiredDocumentDoesNotExist()
    {
        var response = await client.GetAsync("api/registration/student/required-docs/uploaded?reqId=40000&studentNumber=220038627");
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET REQUIRED STUDENT UPLOADED DOCUMENTS INVALID, STUDENT DOES NOT EXIST   ----
    [Fact]
    public async Task GetRequiredStudentUploadedDocumentsInvalid_StudentDoesNotExist()
    {
        var response = await client.GetAsync("api/registration/student/required-docs/uploaded?reqId=4&studentNumber=1000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD STUDENT REGISTRATION FILE VALID   ----
    [Fact]
    public async Task Post_AddStudentRegistrationFileValid()
    {
        string jsonStr = JsonSerializer.Serialize(new AddStudentRegistrationFileRequest()
        {
            filePath = "some-file-path-idk",
            requiredId = 4,
            studentNumber = "220038627",
            name = "does it matter?"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/registration/students/files/upload", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD STUDENT REGISTRATION FILE INVALID, FILE ALREADY EXISTS   ----
    [Fact]
    public async Task Post_AddStudentRegistrationFileInvalid_FileAlreadyExists()
    {
        string jsonStr = JsonSerializer.Serialize(new AddStudentRegistrationFileRequest()
        {
            filePath = "some-file-path-1",
            requiredId = 4,
            studentNumber = "220038627",
            name = "does it matter?"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/registration/students/files/upload", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD STUDENT REGISTRATION FILE INVALID, STUDENT DOES NOT EXIST   ----
    [Fact]
    public async Task Post_AddStudentRegistrationFileInvalid_StudentDoesNotExist()
    {
        string jsonStr = JsonSerializer.Serialize(new AddStudentRegistrationFileRequest()
        {
            filePath = "some-file-path-ikkkkdjsnf",
            requiredId = 4,
            studentNumber = "22003862799",
            name = "does it matter?"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/registration/students/files/upload", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD STUDENT REGISTRATION FILE INVALID, REQUIRED DOCUMENT DOES NOT EXIST   ----
    [Fact]
    public async Task Post_AddStudentRegistrationFileInvalid_RequiredDocumentDoesNotExist()
    {
        string jsonStr = JsonSerializer.Serialize(new AddStudentRegistrationFileRequest()
        {
            filePath = "some-file-path-ikkk",
            requiredId = 10000,
            studentNumber = "220038627",
            name = "does it matter?"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/registration/students/files/upload", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD STUDENT REGISTRATION FILE INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_AddStudentRegistrationFileInvalid_BadRequest()
    {
        string jsonStr = JsonSerializer.Serialize(new AddStudentRegistrationFileRequest()
        {
            filePath = "",
            requiredId = 4,
            studentNumber = "220038627",
            name = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/registration/students/files/upload", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   REQUEST STUDENT REGISTRATION APPROVAL VALID   ----
    [Fact]
    public async Task Get_RequestStudentRegistrationApprovalValid()
    {
        var response = await client.GetAsync("api/registration/student/approval/request/220038627");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   REQUEST STUDENT REGISTRATION APPROVAL INVALID, STUDENT NOT FOUND   ----
    [Fact]
    public async Task Get_RequestStudentRegistrationApprovalInalid_StudentNotFound()
    {
        var response = await client.GetAsync("api/registration/student/approval/request/110038627");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET REGISTRATION STATUS FOR STUDENT VALID   ----
    [Fact]
    public async Task GetRegistrationStatusForStudentValid()
    {
        var response = await client.GetAsync("api/registration/student/status/220038627");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET REGISTRATION STATUS FOR STUDENT INVALID, STUDENT NOT FOUND   ----
    [Fact]
    public async Task GetRegistrationStatusForStudentInvalid_StudentNotFound()
    {
        var response = await client.GetAsync("api/registration/student/status/110038627");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }
}