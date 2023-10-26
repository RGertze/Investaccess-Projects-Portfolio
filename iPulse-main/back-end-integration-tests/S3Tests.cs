
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using Pulse_back_end.Models;
using iPulse_back_end.Models;
using Microsoft.Extensions.Configuration;
using iPulse_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_2")]
public class S3Tests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;

    public S3Tests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
    {
        client = factory.CreateDefaultClient();
        client.Timeout = TimeSpan.FromSeconds(600);
        _testOutputHelper = testOutputHelper;

        IConfigurationBuilder builder = new ConfigurationBuilder();
        builder.AddJsonFile("appsettings.Development.json", false, true);
        config = builder.Build();

        JwtHandler jwtHandler = new JwtHandler(config);
        adminToken = jwtHandler.generate(9, 1);
        doctorToken = jwtHandler.generate(2, 2);
        patientToken = jwtHandler.generate(4, 3);
        invalidToken = jwtHandler.generate(10000000, 1);

    }

    //----   GET PRESIGNED GET URL VALID   ----
    [Fact]
    public async Task Post_GetPresignedGetUrlValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new GetPresignedGetUrlRequest()
        {
            filePath = "some-file-path"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/s3/signed/get", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PRESIGNED GET URL INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_GetPresignedGetUrlInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new GetPresignedGetUrlRequest()
        {
            filePath = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/s3/signed/get", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   GET PRESIGNED GET URL INVALID, NO TOKEN   ----
    // [Fact]
    // public async Task Post_GetPresignedGetUrlInvalid_NoToken()
    // {
    //     client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
    //     string jsonStr = JsonSerializer.Serialize(new GetPresignedGetUrlRequest()
    //     {
    //         filePath = ""
    //     });
    //     HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
    //     var response = await client.PostAsync("api/s3/signed/get", content);
    //     _testOutputHelper.WriteLine(response.ToString());
    //     _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

    //     Assert.False(response.IsSuccessStatusCode);
    //     Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    // }

    //----   GET PRESIGNED PUT URL VALID   ----
    [Fact]
    public async Task Post_GetPresignedPutUrlValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new GetPresignedPutUrlRequest()
        {
            filename = "some-file-name"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/s3/signed/put", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PRESIGNED PUT URL INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_GetPresignedPutUrlInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new GetPresignedPutUrlRequest()
        {
            filename = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/s3/signed/put", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   GET PRESIGNED PUT URL INVALID, NO TOKEN   ----
    [Fact]
    public async Task Post_GetPresignedPutUrlInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new GetPresignedPutUrlRequest()
        {
            filename = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/s3/signed/put", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }
}
