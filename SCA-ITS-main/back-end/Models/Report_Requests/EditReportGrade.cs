namespace SCA_ITS_back_end.Models;

public class EditReportGrade : BaseRequest
{
    public int? id { get; set; }
    public string? grade { get; set; }
}