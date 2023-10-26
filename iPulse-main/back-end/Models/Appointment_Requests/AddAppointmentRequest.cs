using System.ComponentModel.DataAnnotations;

namespace iPulse_back_end.Models;

public class AddAppointmentRequest : BaseRequest
{
    public int slotId { get; set; }
    public int patientId { get; set; }
    public string? title { get; set; }
    public string? description { get; set; }
    public string? date { get; set; }
}