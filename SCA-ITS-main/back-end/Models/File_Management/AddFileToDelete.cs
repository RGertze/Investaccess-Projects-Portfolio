
namespace SCA_ITS_back_end.Models;

public class AddFileToDelete : BaseRequest
{
    public string? filePath { get; set; }
    public string? fileName { get; set; }
}