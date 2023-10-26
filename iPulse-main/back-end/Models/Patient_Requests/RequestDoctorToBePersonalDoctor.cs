
namespace iPulse_back_end.Models;

public class RequestDoctorToBePersonalDoctor : BaseRequest
{
    public int patientId { get; set; }
    public int doctorId { get; set; }
    public int? typeId { get; set; }
}