using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class RefreshTokenRequest : BaseRequest
{
    public string? token { get; set; }
    public string? refreshToken { get; set; }
}