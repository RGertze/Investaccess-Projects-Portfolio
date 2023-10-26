namespace SCA_ITS_back_end.Models;


public class EditReportDetails : BaseRequest
{
    public int? id { get; set; }
    public int? daysAbsent { get; set; }
    public int? dominantHand { get; set; }
    public string? personaBriefComments { get; set; }
    public string? remarks { get; set; }
    public string? registerTeacher { get; set; }
}