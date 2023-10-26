namespace iPulse_back_end.Models;

public class AddPatientNextOfKin : BaseRequest
{
    public int? patientId { get; set; }
    public string? fullName { get; set; }
    public string? cellPhone { get; set; }
    public string? email { get; set; }
    public string? residentialAddress { get; set; }
    public string? relationship { get; set; }
}