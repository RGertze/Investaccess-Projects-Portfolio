using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class BloodType
    {
        public BloodType()
        {
            PatientProfiles = new HashSet<PatientProfile>();
        }

        public int BloodTypeId { get; set; }
        public string? BloodTypeName { get; set; }

        public virtual ICollection<PatientProfile> PatientProfiles { get; set; }
    }
}
