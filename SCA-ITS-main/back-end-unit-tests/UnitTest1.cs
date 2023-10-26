using SCA_ITS_back_end.DB_Models;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace back_end_unit_tests;

public class UnitTest1 : BaseTest
{
    private readonly ITestOutputHelper _testOutputHelper;

    public UnitTest1(ITestOutputHelper testOutputHelper)
    {
        this._testOutputHelper = testOutputHelper;
    }

    [Fact]
    public async Task Test1()
    {
        Assert.Equal(0, 0);
    }
}