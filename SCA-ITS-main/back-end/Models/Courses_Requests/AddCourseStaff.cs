using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class AddCourseStaff : BaseRequest
{
    public string? courseId { get; set; }
    public int? staffId { get; set; }
}