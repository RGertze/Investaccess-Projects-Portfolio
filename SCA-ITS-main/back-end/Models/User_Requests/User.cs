
namespace SCA_ITS_back_end.Models;


public class User : BaseRequest
{
    public int UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
}