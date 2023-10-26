namespace SCA_ITS_back_end.Models;

public class SyncCourseCategoryCreatedUpdatedRequest : LambdaBaseRequest
{
    public int? id { get; set; }
    public string? name { get; set; }
    public string? description { get; set; }
    public int? parent { get; set; }
}