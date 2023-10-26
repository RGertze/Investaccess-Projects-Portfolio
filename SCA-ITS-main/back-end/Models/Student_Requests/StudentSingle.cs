
namespace SCA_ITS_back_end.Models;


public class StudentSingle
{
    public int ParentId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string StudentNumber { get; set; }
    public string dob { get; set; }
    public int Grade { get; set; }
    public int RegistrationStage { get; set; }
    public string ParentEmail { get; set; }
    public string CreatedAt { get; set; }
}