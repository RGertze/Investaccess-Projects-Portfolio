using System.ComponentModel.DataAnnotations;

namespace iPulse_back_end.Models;

public class AddAppointmentSlot : BaseRequest
{
    public int doctorId { get; set; }
    public int day { get; set; }
    public string? startTime { get; set; }
    public string? endTime { get; set; }
}