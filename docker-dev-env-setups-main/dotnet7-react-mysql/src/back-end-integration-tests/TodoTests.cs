
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using Microsoft.Extensions.Configuration;
using back_end.Utilities;
using back_end.Models;

namespace back_end_tests;

[Collection("GROUP_1")]
public class TodoTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string userToken;
    private string invalidToken;

    public TodoTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
    {
        client = factory.CreateDefaultClient();
        client.Timeout = TimeSpan.FromSeconds(600);
        _testOutputHelper = testOutputHelper;

        IConfigurationBuilder builder = new ConfigurationBuilder();
        builder.AddJsonFile("appsettings.Development.json", false, true);
        config = builder.Build();

        JwtHandler jwtHandler = new JwtHandler(config);
        adminToken = jwtHandler.generate(1, 1);
        userToken = jwtHandler.generate(2, 2);
        invalidToken = jwtHandler.generate(10000000, 1);
    }

    [Fact]
    public async Task GetAllTodos_ReturnsSuccessStatusCode()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/todo");
        request.Headers.Add("Authorization", "Bearer " + adminToken);

        // Act
        var response = await client.SendAsync(request);

        // Assert
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task GetTodoById_ReturnsSuccessStatusCode()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/todo/4");
        request.Headers.Add("Authorization", "Bearer " + adminToken);

        // Act
        var response = await client.SendAsync(request);

        // Assert
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task GetTodoByIdNotFound_ReturnsNotFoundStatusCode()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/todo/100");
        request.Headers.Add("Authorization", "Bearer " + adminToken);

        // Act
        var response = await client.SendAsync(request);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetAllTodosForUser_ReturnsSuccessStatusCode()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/todo/user/2");
        request.Headers.Add("Authorization", "Bearer " + userToken);

        // Act
        var response = await client.SendAsync(request);

        // Assert
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task GetAllTodosForUserNotFound_ReturnsNotFoundStatusCode()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/todo/user/100");
        request.Headers.Add("Authorization", "Bearer " + adminToken);

        // Act
        var response = await client.SendAsync(request);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateTodo_ReturnsSuccessStatusCode()
    {
        // Arrange
        var todo = new Todo
        {
            UserId = 2,
            Name = "Todo 1",
            Description = "Todo 1",
            IsComplete = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        var json = JsonSerializer.Serialize(todo);
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/todo");
        request.Headers.Add("Authorization", "Bearer " + adminToken);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await client.SendAsync(request);

        // Assert
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task CreateTodoWithInvalidUserId_ReturnsNotFoundStatusCode()
    {
        // Arrange
        var todo = new Todo
        {
            UserId = 100,
            Name = "Todo 1",
            Description = "Todo 1",
            IsComplete = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        var json = JsonSerializer.Serialize(todo);
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/todo");
        request.Headers.Add("Authorization", "Bearer " + adminToken);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await client.SendAsync(request);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateTodoWithInvalidName_ReturnsBadRequestStatusCode()
    {
        // Arrange
        var todo = new Todo
        {
            UserId = 2,
            Name = "",
            Description = "Todo 1",
            IsComplete = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        var json = JsonSerializer.Serialize(todo);
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/todo");
        request.Headers.Add("Authorization", "Bearer " + adminToken);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await client.SendAsync(request);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateTodo_ReturnsSuccessStatusCode()
    {
        // Arrange
        var todo = new Todo
        {
            Id = 4,
            UserId = 2,
            Name = "Todo 1",
            Description = "Todo 1",
            IsComplete = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        var json = JsonSerializer.Serialize(todo);
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/todo/4");
        request.Headers.Add("Authorization", "Bearer " + adminToken);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await client.SendAsync(request);

        // Assert
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task UpdateTodoWithInvalidId_ReturnsNotFoundStatusCode()
    {
        // Arrange
        var todo = new Todo
        {
            Id = 100,
            UserId = 2,
            Name = "Todo 1",
            Description = "Todo 1",
            IsComplete = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        var json = JsonSerializer.Serialize(todo);
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/todo/100");
        request.Headers.Add("Authorization", "Bearer " + adminToken);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await client.SendAsync(request);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateTodoWithInvalidName_ReturnsBadRequestStatusCode()
    {
        // Arrange
        var todo = new Todo
        {
            Id = 1,
            UserId = 2,
            Name = null,
            Description = "Todo 1",
            IsComplete = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        var json = JsonSerializer.Serialize(todo);
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/todo/1");
        request.Headers.Add("Authorization", "Bearer " + adminToken);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await client.SendAsync(request);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task DeleteTodo_ReturnsSuccessStatusCode()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Delete, "/api/todo/1");
        request.Headers.Add("Authorization", "Bearer " + adminToken);

        // Act
        var response = await client.SendAsync(request);

        // Assert
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task DeleteTodoWithInvalidId_ReturnsNotFoundStatusCode()
    {
        var request = new HttpRequestMessage(HttpMethod.Delete, "/api/todo/100");
        request.Headers.Add("Authorization", "Bearer " + adminToken);

        var response = await client.SendAsync(request);

        Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }

}
