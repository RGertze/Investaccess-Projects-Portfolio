using Pulse_back_end.Models;

namespace iPulse_back_end.Models;

public class PatientRegistrationRequest : BaseRequest
{
    public string? email { get; set; }
    public string? idNumber { get; set; }
    public int? medicalAidScheme { get; set; }
    public string? memberNumber { get; set; }
}