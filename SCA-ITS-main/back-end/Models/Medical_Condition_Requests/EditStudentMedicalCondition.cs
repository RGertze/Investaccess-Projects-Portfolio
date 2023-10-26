using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class EditStudentMedicalCondition : BaseRequest
{
    public string? studentNumber { get; set; }
    public List<int>? conditionIds { get; set; }
}