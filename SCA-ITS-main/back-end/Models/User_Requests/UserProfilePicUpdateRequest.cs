using SCA_ITS_back_end.Models;

namespace SCA_ITS_back_end.Models;

public class UserProfilePicUpdateRequest : BaseRequest
{
    public int userId { get; set; }
    public string profilePicPath { get; set; }
}