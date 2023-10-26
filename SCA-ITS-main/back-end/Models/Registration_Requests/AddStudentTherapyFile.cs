
namespace SCA_ITS_back_end.Models;

public class AddStudentTherapyFile : BaseRequest
{
    public string? studentNumber { get; set; }
    public string? filePath { get; set; }
    public string? fileName { get; set; }
}