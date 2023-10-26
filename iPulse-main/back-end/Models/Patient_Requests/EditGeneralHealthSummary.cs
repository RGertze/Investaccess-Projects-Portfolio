namespace iPulse_back_end.Models;

public class EditGeneralHealthSummary : BaseRequest
{
    public int? id { get; set; }

    public string? content { get; set; }
}