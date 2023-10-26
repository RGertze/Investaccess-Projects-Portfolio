
using System.Text;
using System.Text.Json;
using System.Net;
using Xunit.Abstractions;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Services;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_4")]
public class OtherParentTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    public OtherParentTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    #region Get

    //----   GET ALL FOR STUDENT VALID   ----
    [Fact]
    public async Task getAllForStudentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/other-parents/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    #endregion

    #region ADD

    //----   ADD OTHER PARENT VALID   ----
    [Fact]
    public async Task addOtherParentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddOtherParent()
        {
            mainParentId = 2,
            firstName = "sdf",
            lastName = "sdf",
            cellNumber = "dskfn",
            employer = "sdkfnj",
            fax = "anksd",
            idNumber = "sdkfjn",
            maritalStatus = "sdfknj",
            monthlyIncome = 20000,
            occupation = "ksdjfn",
            postalAddress = "jknjnsfd",
            residentialAddress = "kjdfn",
            specialistSkillsHobbies = "sdkfn",
            telephoneHome = "jksdfn",
            telephoneWork = "sdkfjn",
            workingHours = "sjkdfn"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/other-parents/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD OTHER PARENT INVALID, MAIN PARENT NOT FOUND   ----
    [Fact]
    public async Task addOtherParentInvalid_MainParentNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddOtherParent()
        {
            mainParentId = 2000,
            firstName = "sdf",
            lastName = "sdf",
            cellNumber = "dskfn",
            employer = "sdkfnj",
            fax = "anksd",
            idNumber = "sdkfjn",
            maritalStatus = "sdfknj",
            monthlyIncome = 20000,
            occupation = "ksdjfn",
            postalAddress = "jknjnsfd",
            residentialAddress = "kjdfn",
            specialistSkillsHobbies = "sdkfn",
            telephoneHome = "jksdfn",
            telephoneWork = "sdkfjn",
            workingHours = "sjkdfn"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/other-parents/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD OTHER PARENT INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task addOtherParentInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddOtherParent()
        {
            mainParentId = null,
            firstName = "sdf",
            lastName = "sdf",
            cellNumber = "",
            employer = "",
            fax = "",
            idNumber = "",
            maritalStatus = "",
            monthlyIncome = null,
            occupation = "ksdjfn",
            postalAddress = "jknjnsfd",
            residentialAddress = "kjdfn",
            specialistSkillsHobbies = "sdkfn",
            telephoneHome = "jksdfn",
            telephoneWork = "sdkfjn",
            workingHours = "sjkdfn"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/other-parents/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    #endregion

    #region Edit

    //----   EDIT OTHER PARENT VALID   ----
    [Fact]
    public async Task editOtherParentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditOtherParent()
        {
            id = 1,
            cellNumber = "sdfjnsdkjf"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/other-parents/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   EDIT OTHER PARENT INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task editOtherParentInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditOtherParent()
        {
            id = null,
            cellNumber = "sdfjnsdkjf"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/other-parents/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   EDIT OTHER PARENT INVALID, NOT FOUND   ----
    [Fact]
    public async Task editOtherParentInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditOtherParent()
        {
            id = 39999,
            cellNumber = "sdfjnsdkjf"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/other-parents/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    #endregion

    #region DELETE

    //----   DELETE OTHER PARENT VALID   ----
    [Fact]
    public async Task deleteOtherParentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/other-parents/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE OTHER PARENT INVALID, NOT FOUND   ----
    [Fact]
    public async Task deleteOtherParentInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/other-parents/333333");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    #endregion
}