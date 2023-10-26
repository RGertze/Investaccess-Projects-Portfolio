
namespace iPulse_back_end.Models;

public class SearchDoctorsQuery : BaseRequest
{
    public int? specialtyId { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public string? email { get; set; }
    public string? nationality { get; set; }
    public string? city { get; set; }
}