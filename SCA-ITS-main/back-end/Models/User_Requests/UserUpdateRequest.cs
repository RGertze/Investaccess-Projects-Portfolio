using SCA_ITS_back_end.Models;

namespace SCA_ITS_back_end.Models;


public class UserUpdateRequest : BaseRequest
{
    public string? email { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public string? profilePicPath { get; set; }
}