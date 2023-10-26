using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class PatientProfile
    {
        public PatientProfile()
        {
            Appointments = new HashSet<Appointment>();
            DoctorReviews = new HashSet<DoctorReview>();
            GeneralHealthSummaries = new HashSet<GeneralHealthSummary>();
            PatientDoctors = new HashSet<PatientDoctor>();
            PatientNextOfKins = new HashSet<PatientNextOfKin>();
            PatientProfileAccesses = new HashSet<PatientProfileAccess>();
        }

        public int UserId { get; set; }
        public int MedicalAidSchemeId { get; set; }
        public string IdNumber { get; set; } = null!;
        public string? MemberNumber { get; set; }
        public string? Nationality { get; set; }
        public string? ResidentialAddress { get; set; }
        public string? PostalAddress { get; set; }
        public int? Age { get; set; }
        public int? GenderId { get; set; }
        public int? BloodTypeId { get; set; }
        public string? SecondaryCellphone { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual BloodType? BloodType { get; set; }
        public virtual Gender? Gender { get; set; }
        public virtual MedicalAidScheme MedicalAidScheme { get; set; } = null!;
        public virtual UserAccount User { get; set; } = null!;
        public virtual ICollection<Appointment> Appointments { get; set; }
        public virtual ICollection<DoctorReview> DoctorReviews { get; set; }
        public virtual ICollection<GeneralHealthSummary> GeneralHealthSummaries { get; set; }
        public virtual ICollection<PatientDoctor> PatientDoctors { get; set; }
        public virtual ICollection<PatientNextOfKin> PatientNextOfKins { get; set; }
        public virtual ICollection<PatientProfileAccess> PatientProfileAccesses { get; set; }
    }
}
