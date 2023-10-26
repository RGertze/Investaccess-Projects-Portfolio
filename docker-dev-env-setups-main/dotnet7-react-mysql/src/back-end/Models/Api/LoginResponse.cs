namespace back_end.Models;

public class LoginResponse
{
    public int id { get; set; }
    public int roleId { get; set; }
    public bool emailConfirmed { get; set; }
    public ApiTokens tokens { get; set; }
}
