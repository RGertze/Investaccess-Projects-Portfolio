
namespace iPulse_back_end.Models;

public class CancelAppointment : BaseRequest
{
    public int appointmentId { get; set; }
    public int userId { get; set; }
    public string? reason { get; set; }
}