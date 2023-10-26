using SCA_ITS_back_end.Services;
using SCA_ITS_back_end.Models;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace back_end_unit_tests;

public class FilesToDeleteTests : BaseTest
{
    private readonly ITestOutputHelper _testOutputHelper;
    private FilesToDeleteService filesToDeleteService;

    public FilesToDeleteTests(ITestOutputHelper testOutputHelper)
    {
        this._testOutputHelper = testOutputHelper;
        this.filesToDeleteService = new FilesToDeleteService(this.dbContext);
    }


    #region Get

    //----   GET ALL FILES TO DELETE VALID   ----
    [Fact]
    public async Task getAllFilesToDeleteValid()
    {
        var response = await filesToDeleteService.GetAll();
        Assert.Equal("", response.errorMessage);
    }

    #endregion

    #region Add

    //----   ADD FILE TO DELETE VALID   ----
    [Fact]
    public async Task addFileToDeleteValid()
    {
        var records = new List<AddFileToDelete>(){
            new AddFileToDelete(){
                filePath="path-3",
                fileName="name"
            }
        };
        var response = await filesToDeleteService.AddMany(records);
        Assert.Equal("", response.errorMessage);
    }

    //----   ADD MULTIPLE FILES TO DELETE VALID   ----
    [Fact]
    public async Task addMultipleFilesToDeleteValid()
    {
        var records = new List<AddFileToDelete>(){
            new AddFileToDelete(){
                filePath="path-4",
                fileName="name"
            },
            new AddFileToDelete(){
                filePath="path-5",
                fileName="name"
            },
        };
        var response = await filesToDeleteService.AddMany(records);
        Assert.Equal("", response.errorMessage);
    }

    //----   ADD MULTIPLE FILES TO DELETE VALID, DUPLICATES   ----
    [Fact]
    public async Task addMultipleFilesToDeleteValid_Duplicates()
    {
        var records = new List<AddFileToDelete>(){
            new AddFileToDelete(){
                filePath="path-1",
                fileName="name"
            },
            new AddFileToDelete(){
                filePath="path-6",
                fileName="name"
            },
        };
        var response = await filesToDeleteService.AddMany(records);
        Assert.Equal("", response.errorMessage);
    }

    //----   ADD MULTIPLE FILES TO DELETE INVALID, ONE OR MORE FILES WITH EMPTY VALUES   ----
    [Fact]
    public async Task addMultipleFilesToDeleteInvalid_OneOrMoreFilesWithEmptyValues()
    {
        var records = new List<AddFileToDelete>(){
            new AddFileToDelete(){
                filePath="",
                fileName=null
            },
            new AddFileToDelete(){
                filePath="path-7",
                fileName="name"
            },
        };
        var response = await filesToDeleteService.AddMany(records);
        Assert.Equal(400, response.data);
    }

    #endregion

    #region Delete

    //----   DELETE FILE TO DELETE VALID   ----
    [Fact]
    public async Task deleteFileToDeleteValid()
    {
        var records = new List<DeleteFileToDelete>(){
            new DeleteFileToDelete(){
                filePath="path-2",
            },
        };
        var response = await filesToDeleteService.DeleteMany(records);
        Assert.Equal("", response.errorMessage);
    }

    //----   DELETE MULTIPLE FILES TO DELETE VALID, DUPLICATES   ----
    [Fact]
    public async Task deleteMultipleFilesToDeleteValid_Duplicates()
    {
        var records = new List<DeleteFileToDelete>(){
            new DeleteFileToDelete(){
                filePath="path-1",
            },
            new DeleteFileToDelete(){
                filePath="path-1",
            },
        };
        var response = await filesToDeleteService.DeleteMany(records);
        Assert.Equal("", response.errorMessage);
    }

    //----   DELETE FILES TO DELETE INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task deleteFilesToDeleteInvalid_EmptyValues()
    {
        var records = new List<DeleteFileToDelete>(){
            new DeleteFileToDelete(){
                filePath="",
            },
            new DeleteFileToDelete(){
                filePath=null,
            },
        };
        var response = await filesToDeleteService.DeleteMany(records);
        Assert.Equal(400, response.data);
    }

    //----   DELETE FILES TO DELETE INVALID, NOT FOUND   ----
    [Fact]
    public async Task deleteFilesToDeleteInvalid_NotFound()
    {
        var records = new List<DeleteFileToDelete>(){
            new DeleteFileToDelete(){
                filePath="not-found-1",
            },
            new DeleteFileToDelete(){
                filePath="not-found-2",
            },
        };
        var response = await filesToDeleteService.DeleteMany(records);
        Assert.Equal(404, response.data);
    }

    #endregion
}