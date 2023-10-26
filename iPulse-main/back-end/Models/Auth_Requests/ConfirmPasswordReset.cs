using System.ComponentModel.DataAnnotations;

namespace iPulse_back_end.Models;

public class ConfirmPasswordReset : BaseRequest
{
    public string? email { get; set; }
    public string? confirmationCode { get; set; }
}