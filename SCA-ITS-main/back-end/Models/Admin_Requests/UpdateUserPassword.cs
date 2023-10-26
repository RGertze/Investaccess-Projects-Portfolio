namespace SCA_ITS_back_end.Models;

public class UpdateUserPassword : BaseRequest
{
    public int? userId { get; set; }
    public string? password { get; set; }
}