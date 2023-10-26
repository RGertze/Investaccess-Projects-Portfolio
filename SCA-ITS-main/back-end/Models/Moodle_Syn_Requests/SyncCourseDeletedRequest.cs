namespace SCA_ITS_back_end.Models;

public class SyncCourseDeletedRequest : LambdaBaseRequest
{
    public int? id { get; set; }
}