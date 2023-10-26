using System.ComponentModel.DataAnnotations;

namespace iPulse_back_end.Models;

public class LoginDetails
{
    public string? username { get; set; }
    public string? password { get; set; }
}