
namespace iPulse_back_end.Models;

public class SearchPatientQuery : BaseRequest
{
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public string? email { get; set; }
    public int? doctorId { get; set; }
}