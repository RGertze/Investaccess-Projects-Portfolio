using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class RejectStudentRegistration : BaseRequest
{
    public string? studentNumber { get; set; }
    public int? registrationStage { get; set; }
    public string? reason { get; set; }
}