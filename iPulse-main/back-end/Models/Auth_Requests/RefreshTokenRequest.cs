using System.ComponentModel.DataAnnotations;

namespace iPulse_back_end.Models;

public class RefreshTokenRequest : BaseRequest
{
    public string? token { get; set; }
    public string? refreshToken { get; set; }
}