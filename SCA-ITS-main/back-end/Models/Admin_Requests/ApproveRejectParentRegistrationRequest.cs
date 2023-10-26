using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class ApproveRejectParentRegistrationRequest : BaseRequest
{
    public int? userId { get; set; }
    public string? reason { get; set; }
}