namespace SCA_ITS_back_end.Models;

public class EditAssessment : BaseRequest
{
    public int? id { get; set; }
    public string? name { get; set; }
    public decimal? marksAvailable { get; set; }
}