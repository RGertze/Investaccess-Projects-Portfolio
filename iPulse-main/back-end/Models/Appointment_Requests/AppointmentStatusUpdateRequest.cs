
namespace iPulse_back_end.Models;

public class AppointmentStatusUpdateRequest : BaseRequest
{
    public int appointmentId { get; set; }
    public int patientId { get; set; }
}