using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class MedicalAidScheme
    {
        public MedicalAidScheme()
        {
            PatientProfiles = new HashSet<PatientProfile>();
        }

        public int MedicalAidSchemeId { get; set; }
        public string MedicalAidSchemeName { get; set; } = null!;
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<PatientProfile> PatientProfiles { get; set; }
    }
}
