namespace SCA_ITS_back_end.Models;

public class SyncCourseCreatedUpdatedRequest : LambdaBaseRequest
{
    public int? id { get; set; }
    public string? shortname { get; set; }
    public string? fullname { get; set; }
    public int? category { get; set; }
}