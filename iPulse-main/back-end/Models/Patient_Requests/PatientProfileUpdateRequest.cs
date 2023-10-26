
namespace iPulse_back_end.Models;

public class PatientProfileUpdateRequest
{
    public int UserId { get; set; }
    public int? MedicalAidSchemeId { get; set; }
    public string IdNumber { get; set; } = null!;
    public string? MemberNumber { get; set; }
    public string? Nationality { get; set; }
    public string? ResidentialAddress { get; set; }
    public string? PostalAddress { get; set; }
    public int? Age { get; set; }
    public int? Gender { get; set; }
    public int? BloodType { get; set; }
    public string? SecondaryCellphone { get; set; }
}