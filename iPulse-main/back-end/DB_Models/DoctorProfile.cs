using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class DoctorProfile
    {
        public DoctorProfile()
        {
            AppointmentSlots = new HashSet<AppointmentSlot>();
            DoctorEducations = new HashSet<DoctorEducation>();
            DoctorReviews = new HashSet<DoctorReview>();
            DoctorServices = new HashSet<DoctorService>();
            DoctorWorkHistories = new HashSet<DoctorWorkHistory>();
            GeneralHealthSummaries = new HashSet<GeneralHealthSummary>();
            PatientDoctors = new HashSet<PatientDoctor>();
            PatientProfileAccesses = new HashSet<PatientProfileAccess>();
            Receptionists = new HashSet<Receptionist>();
        }

        public int UserId { get; set; }
        public int SpecialtyId { get; set; }
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
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual DoctorSpecialty Specialty { get; set; } = null!;
        public virtual UserAccount User { get; set; } = null!;
        public virtual ICollection<AppointmentSlot> AppointmentSlots { get; set; }
        public virtual ICollection<DoctorEducation> DoctorEducations { get; set; }
        public virtual ICollection<DoctorReview> DoctorReviews { get; set; }
        public virtual ICollection<DoctorService> DoctorServices { get; set; }
        public virtual ICollection<DoctorWorkHistory> DoctorWorkHistories { get; set; }
        public virtual ICollection<GeneralHealthSummary> GeneralHealthSummaries { get; set; }
        public virtual ICollection<PatientDoctor> PatientDoctors { get; set; }
        public virtual ICollection<PatientProfileAccess> PatientProfileAccesses { get; set; }
        public virtual ICollection<Receptionist> Receptionists { get; set; }
    }
}
