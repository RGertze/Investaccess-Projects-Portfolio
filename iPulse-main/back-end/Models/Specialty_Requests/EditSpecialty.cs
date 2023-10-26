using iPulse_back_end.Models;

namespace Pulse_back_end.Models;

public class EditSpecialty : BaseRequest
{
    public int? id { get; set; }
    public string? name { get; set; }
}