
namespace iPulse_back_end.Models;

public class ApproveRejectRequestToBePersonalDoctor : BaseRequest
{
    public int patientId { get; set; }
    public int doctorId { get; set; }
    public string? approvalCode { get; set; }
}