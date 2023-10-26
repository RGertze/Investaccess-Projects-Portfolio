using back_end.Services;
using back_end.Models;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace back_end_unit_tests;

public class TodoTests : BaseTest
{
    private readonly ITestOutputHelper _testOutputHelper;
    private ITodoService todoService;

    public TodoTests(ITestOutputHelper testOutputHelper)
    {
        this._testOutputHelper = testOutputHelper;
        this.todoService = new TodoService(this.dbContext);
    }


    #region Get

    /// <summary>
    ///     Test get all todos    
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task getAllTodos()
    {
        var response = await todoService.GetAll();
        Assert.Equal(200, response.statusCode);
    }

    /// <summary>
    ///    Test get todo by id
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task getTodoById()
    {
        var response = await todoService.GetById(1);
        Assert.Equal(200, response.statusCode);
    }

    /// <summary>
    ///   Get by id not found
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task getTodoByIdNotFound()
    {
        var response = await todoService.GetById(100);
        Assert.Equal(404, response.statusCode);
    }

    /// <summary>
    ///    Get all todos for user
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task getAllTodosForUser()
    {
        var response = await todoService.GetAllForUser(2);
        Assert.Equal(200, response.statusCode);
    }

    /// <summary>
    ///   Get all todos for user not found
    ///  </summary>
    /// <returns></returns>
    [Fact]
    public async Task getAllTodosForUserNotFound()
    {
        var response = await todoService.GetAllForUser(100);
        Assert.Equal(404, response.statusCode);
    }

    #endregion

    #region Create

    /// <summary>
    ///     Test create todo
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task createTodo()
    {
        var todo = new Todo
        {
            UserId = 2,
            Name = "Todo 1",
            Description = "Todo 1",
            IsComplete = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        var response = await todoService.Add(todo);
        Assert.Equal(200, response.statusCode);
    }

    /// <summary>
    ///    Test create todo with invalid user id
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task createTodoWithInvalidUserId()
    {
        var todo = new Todo
        {
            UserId = 100,
            Name = "Todo 1",
            Description = "Todo 1",
            IsComplete = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        var response = await todoService.Add(todo);
        Assert.Equal(404, response.statusCode);
    }

    /// <summary>
    ///   Test create todo with invalid name
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task createTodoWithInvalidName()
    {
        var todo = new Todo
        {
            UserId = 2,
            Name = "",
            Description = "Todo 1",
            IsComplete = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        var response = await todoService.Add(todo);
        Assert.Equal(400, response.statusCode);
    }

    #endregion

    #region Update

    /// <summary>
    ///    Test update todo
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task updateTodo()
    {
        var todo = new Todo
        {
            Id = 1,
            UserId = 2,
            Name = "Todo 1",
            Description = "Todo 1",
            IsComplete = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        var response = await todoService.Update(todo);
        Assert.Equal(200, response.statusCode);
    }

    /// <summary>
    ///   Test update todo with invalid id
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task updateTodoWithInvalidId()
    {
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
        var response = await todoService.Update(todo);
        Assert.Equal(404, response.statusCode);
    }

    /// <summary>
    ///  Test update todo with invalid name
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task updateTodoWithInvalidName()
    {
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
        var response = await todoService.Update(todo);
        Assert.Equal(400, response.statusCode);
    }

    #endregion

    #region Delete

    /// <summary>
    ///   Test delete todo
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task deleteTodo()
    {
        var response = await todoService.Delete(new Todo { Id = 1 });
        Assert.Equal(200, response.statusCode);
    }

    /// <summary>
    ///  Test delete todo with invalid id
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task deleteTodoWithInvalidId()
    {
        var response = await todoService.Delete(new Todo { Id = 100 });
        Assert.Equal(404, response.statusCode);
    }

    #endregion
}