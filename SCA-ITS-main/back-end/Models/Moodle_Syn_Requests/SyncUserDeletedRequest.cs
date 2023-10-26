namespace SCA_ITS_back_end.Models;

public class SyncUserDeletedRequest : LambdaBaseRequest
{
    public string? username { get; set; }
    public string? email { get; set; }
}