
namespace SCA_ITS_back_end.Models;

public class AddRequiredRegistrationDoc : BaseRequest
{
    public int? userTypeId { get; set; }
    public string? name { get; set; }
    public string? description { get; set; }
}