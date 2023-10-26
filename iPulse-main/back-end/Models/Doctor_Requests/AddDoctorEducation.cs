namespace iPulse_back_end.Models;

public class AddDoctorEducation : BaseRequest
{
    public int doctorId { get; set; }
    public string? instituteName { get; set; }
    public string? qualificationName { get; set; }
}
