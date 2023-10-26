namespace SCA_ITS_back_end.Models;

public class AddOtherStudentParent : BaseRequest
{
    public string? studentNumber { get; set; }
    public int? parentId { get; set; }
}