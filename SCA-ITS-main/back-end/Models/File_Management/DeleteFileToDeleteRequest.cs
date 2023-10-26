namespace SCA_ITS_back_end.Models;

public class DeleteFileToDeleteRequest : LambdaBaseRequest
{
    public List<DeleteFileToDelete>? filesToDelete { get; set; }
}