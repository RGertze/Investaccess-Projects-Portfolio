
namespace iPulse_back_end.Models;

public class ProfileAccessRequest : BaseRequest
{
    public int doctorId { get; set; }
    public int patientId { get; set; }
}