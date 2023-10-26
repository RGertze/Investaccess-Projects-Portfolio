namespace SCA_ITS_back_end.Models;

public class StudentSearchParams : BaseRequest
{
    public int? grade { get; set; }
    public int? parentId { get; set; }
    public int? registrationStage { get; set; }
}