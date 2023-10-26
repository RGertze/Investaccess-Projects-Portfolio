
namespace SCA_ITS_back_end.Models;

public class SetStudentInterviewCommentsRequest : BaseRequest
{
    public string? studentNumber { get; set; }
    public string? comments { get; set; }
}