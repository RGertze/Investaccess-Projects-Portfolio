namespace SCA_ITS_back_end.Models;

public class SyncCourseCategoryDeletedRequest : LambdaBaseRequest
{
    public int? id { get; set; }
}