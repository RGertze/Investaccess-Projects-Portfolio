namespace iPulse_back_end.Models;

public class AddGeneralHealthSummary : BaseRequest
{
    public int? patientId { get; set; }
    public int? doctorId { get; set; }

    public string? content { get; set; }
}