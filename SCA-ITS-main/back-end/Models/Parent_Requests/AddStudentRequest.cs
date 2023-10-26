using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class AddStudentRequest : BaseRequest
{
    public int parentId { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public int grade { get; set; }
    public string? dob { get; set; }
}
