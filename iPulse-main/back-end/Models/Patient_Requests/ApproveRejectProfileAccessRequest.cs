
namespace iPulse_back_end.Models;

public class ApproveRejectProfileAccessRequest : BaseRequest
{
    public int doctorId { get; set; }
    public int patientId { get; set; }
    public string? approvalCode { get; set; }
}