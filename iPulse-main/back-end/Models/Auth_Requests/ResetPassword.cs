using System.ComponentModel.DataAnnotations;

namespace iPulse_back_end.Models;

public class ResetPassword : BaseRequest
{
    public string? email { get; set; }
    public string? password { get; set; }
}