using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class AddCourseStudent : BaseRequest
{
    public string? courseId { get; set; }
    public string? studentNumber { get; set; }
}