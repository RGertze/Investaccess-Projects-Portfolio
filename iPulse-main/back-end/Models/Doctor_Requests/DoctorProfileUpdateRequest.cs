
namespace iPulse_back_end.Models;

public class DoctorProfileUpdateRequest
{
    public int UserId { get; set; }
    public int? SpecialtyId { get; set; }
    public string? Nationality { get; set; }
    public string? PracticeNumber { get; set; }
    public string? PracticeName { get; set; }
    public string? PracticeAddress { get; set; }
    public string? PracticeCity { get; set; }
    public string? PracticeCountry { get; set; }
    public string? PracticeWebAddress { get; set; }
    public string? BusinessHours { get; set; }
    public decimal? AppointmentPrice { get; set; }
    public string? SecondaryCellphone { get; set; }
    public string? SecondaryEmail { get; set; }
}