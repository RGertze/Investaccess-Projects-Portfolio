using iPulse_back_end.Models;

namespace Pulse_back_end.Models;

public class UserUpdateRequest : BaseRequest
{
    public string? email { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public string? profilePicPath { get; set; }
}