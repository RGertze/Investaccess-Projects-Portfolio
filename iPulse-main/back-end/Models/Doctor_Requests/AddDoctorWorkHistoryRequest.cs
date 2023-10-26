
namespace iPulse_back_end.Models;

public class AddDoctorWorkHistoryRequest : BaseRequest
{
    public int doctorId { get; set; }
    public string companyName { get; set; }
    public string startDate { get; set; }
    public string endDate { get; set; }
    public string role { get; set; }
    public string duties { get; set; }
}