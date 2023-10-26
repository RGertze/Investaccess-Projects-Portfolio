using iPulse_back_end.Models;

namespace Pulse_back_end.Models;

public class AddReceptionistRequest : BaseRequest
{
    public int? doctorId { get; set; }
    public string? email { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public string? password { get; set; }
}