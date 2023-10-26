using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class EditParentProfileRequest : BaseRequest
{
    public int? userId { get; set; }
    public string? idNumber { get; set; }
    public string? employer { get; set; }
    public string? occupation { get; set; }
    public decimal? monthlyIncome { get; set; }
    public string? workingHours { get; set; }
    public string? specialistSkillsHobbies { get; set; }
    public string? telephoneWork { get; set; }
    public string? telephoneHome { get; set; }
    public string? fax { get; set; }
    public string? cellNumber { get; set; }
    public string? postalAddress { get; set; }
    public string? residentialAddress { get; set; }
    public string? maritalStatus { get; set; }
    public int? registrationStage { get; set; }
}
