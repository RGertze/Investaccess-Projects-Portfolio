using Pulse_back_end.Models;

namespace iPulse_back_end.Models;

public class DoctorRegistrationRequest : BaseRequest
{
    public string? email { get; set; }
    public string? nationality { get; set; }
    public int? specialty { get; set; }
    public string? practiceName { get; set; }
    public string? practiceNumber { get; set; }
}