namespace SCA_ITS_back_end.Models;

public class EditCourseRemark : BaseRequest
{
    public int? id { get; set; }
    public string? remark { get; set; }
    public string? initials { get; set; }
}