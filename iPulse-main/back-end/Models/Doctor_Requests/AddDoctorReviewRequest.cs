
namespace iPulse_back_end.Models;

public class AddDoctorReviewRequest : BaseRequest
{
    public int doctorId { get; set; }
    public int patientId { get; set; }
    public string comment { get; set; }
    public decimal rating { get; set; }
}