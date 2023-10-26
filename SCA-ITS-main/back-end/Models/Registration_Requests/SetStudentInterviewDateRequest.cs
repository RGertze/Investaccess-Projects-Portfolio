
namespace SCA_ITS_back_end.Models;

public class SetStudentInterviewDateRequest : BaseRequest
{
    public string? studentNumber { get; set; }
    public string? date { get; set; }
}