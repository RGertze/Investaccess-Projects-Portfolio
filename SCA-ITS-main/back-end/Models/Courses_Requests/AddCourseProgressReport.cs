using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class AddCourseProgressReport : BaseRequest
{
    public string? courseId { get; set; }
    public int? progressReportId { get; set; }
    public int? numberOfTerms { get; set; }
    public short? year { get; set; }
}