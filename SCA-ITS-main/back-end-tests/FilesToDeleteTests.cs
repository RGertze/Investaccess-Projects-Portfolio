using System.Text;
using System.Text.Json;
using System.Net;
using Xunit.Abstractions;
using SCA_ITS_back_end.Models;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_3")]
public class FilesToDeleteTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    public FilesToDeleteTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    //----   GET ALL FILES TO DELETE VALID   ----
    [Fact]
    public async Task getAllFilesToDeleteValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new LambdaBaseRequest()
        {
            token = config["AWS_LAMBDA:Token"],

        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/files-to-delete/get", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    #endregion

    #region Delete

    //----   DELETE FILE TO DELETE VALID   ----
    [Fact]
    public async Task deleteFileToDeleteValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new DeleteFileToDeleteRequest()
        {
            token = config["AWS_LAMBDA:Token"],
            filesToDelete = new List<DeleteFileToDelete>(){
                new DeleteFileToDelete(){
                    filePath="path-2",
                }
            }
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/files-to-delete/delete", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE MULTIPLE FILES TO DELETE VALID, DUPLICATES   ----
    [Fact]
    public async Task deleteMultipleFilesToDeleteValid_Duplicates()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new DeleteFileToDeleteRequest()
        {
            token = config["AWS_LAMBDA:Token"],
            filesToDelete = new List<DeleteFileToDelete>(){
                new DeleteFileToDelete(){
                    filePath="path-1",
                },
                new DeleteFileToDelete(){
                    filePath="path-1",
                },
            }
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/files-to-delete/delete", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE FILES TO DELETE INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task deleteFilesToDeleteInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new DeleteFileToDeleteRequest()
        {
            token = config["AWS_LAMBDA:Token"],
            filesToDelete = new List<DeleteFileToDelete>(){
                new DeleteFileToDelete(){
                    filePath="",
                },
                new DeleteFileToDelete(){
                    filePath=null,
                },
            }
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/files-to-delete/delete", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   DELETE FILES TO DELETE INVALID, NOT FOUND   ----
    [Fact]
    public async Task deleteFilesToDeleteInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new DeleteFileToDeleteRequest()
        {
            token = config["AWS_LAMBDA:Token"],
            filesToDelete = new List<DeleteFileToDelete>(){
                new DeleteFileToDelete(){
                    filePath="not-found-1",
                },
                new DeleteFileToDelete(){
                    filePath="not-found-2",
                },
            }
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/files-to-delete/delete", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    #endregion

}