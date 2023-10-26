namespace SCA_ITS_back_end.Models;

public class SearchReports : BaseRequest
{
    public int? grade { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public int? staffId { get; set; }
}