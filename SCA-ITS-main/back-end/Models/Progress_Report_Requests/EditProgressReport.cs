namespace SCA_ITS_back_end.Models;

public class EditProgressReport : BaseRequest
{
    public int? id { get; set; }
    public string? name { get; set; }
    public decimal? examMarksAvailable { get; set; }
    public decimal? examWeight { get; set; }
}