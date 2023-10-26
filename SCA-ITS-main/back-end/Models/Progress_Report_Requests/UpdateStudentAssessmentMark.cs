using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class UpdateStudentAssessmentMark : BaseRequest
{
    public int? reportAssessmentId { get; set; }
    public int? studentAssessmentId { get; set; }
    public decimal? mark { get; set; }
}