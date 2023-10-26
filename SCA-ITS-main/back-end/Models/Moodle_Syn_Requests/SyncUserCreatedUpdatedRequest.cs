namespace SCA_ITS_back_end.Models;

public class SyncUserCreatedUpdatedRequest : LambdaBaseRequest
{
    public string? username { get; set; }
    public string? email { get; set; }
    public string? firstname { get; set; }
    public string? lastname { get; set; }
}