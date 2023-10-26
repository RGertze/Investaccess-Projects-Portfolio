using iPulse_back_end.Models;

namespace Pulse_back_end.Models;

public class UserProfilePicUpdateRequest : BaseRequest
{
    public int userId { get; set; }
    public string profilePicPath { get; set; }
}