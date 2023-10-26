using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class StudentRegistrationStatus
    {
        public string StudentNumber { get; set; } = null!;
        public ulong BasicDetailsAdded { get; set; }
        public ulong GeneralInfoAdded { get; set; }
        public ulong ReligiousInfoAdded { get; set; }
        public ulong ScholasticInfoAdded { get; set; }
        public ulong MedicalInfoAdded { get; set; }
        public ulong MedicalConditionsAdded { get; set; }
        public ulong OtherParentsAdded { get; set; }
        public ulong NonScaStudentsAdded { get; set; }
        public ulong RequiredDocsAdded { get; set; }
        public ulong OccupationalTherapyNeeded { get; set; }
        public ulong OccupationalReportAdded { get; set; }
        public string? TherapistName { get; set; }
        public string? TherapistCell { get; set; }
        public string? TherapistEmail { get; set; }
        public string? TherapistUrl { get; set; }
        public ulong DiagnosticTestNeeded { get; set; }
        public ulong DiagnosticResultAdded { get; set; }
        public string? DiagnosticTestLink { get; set; }
        public string? BasicRejectionMessage { get; set; }
        public string? GeneralRejectionMessage { get; set; }
        public string? ReligiousRejectionMessage { get; set; }
        public string? ScholasticRejectionMessage { get; set; }
        public string? MedicalRejectionMessage { get; set; }
        public string? ConditionsRejectionMessage { get; set; }
        public string? OtherParentsRejectionMessage { get; set; }
        public string? NonScaRejectionMessage { get; set; }
        public string? RequiredDocsRejectionMessage { get; set; }
        public string? TherapyRejectionMessage { get; set; }
        public string? DiagnosticRejectionMessage { get; set; }

        public virtual Student StudentNumberNavigation { get; set; } = null!;
    }
}
