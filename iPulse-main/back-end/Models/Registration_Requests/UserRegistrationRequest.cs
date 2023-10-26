using iPulse_back_end.Models;

namespace Pulse_back_end.Models;

public class UserRegistrationRequest : BaseRequest
{
    public int? userType { get; set; }
    public string? email { get; set; }
    public string? password { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }

}