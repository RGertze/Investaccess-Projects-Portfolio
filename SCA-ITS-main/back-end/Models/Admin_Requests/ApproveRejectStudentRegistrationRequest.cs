using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class ApproveRejectStudentRegistrationRequest : BaseRequest
{
    public string? studentNumber { get; set; }
    public string? reason { get; set; }
}