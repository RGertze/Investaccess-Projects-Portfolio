using iPulse_back_end.Models;

namespace Pulse_back_end.Models;

public class UpdateUserAccountStatus : BaseRequest
{
    public int? userId { get; set; }
    public ulong? status { get; set; }
}