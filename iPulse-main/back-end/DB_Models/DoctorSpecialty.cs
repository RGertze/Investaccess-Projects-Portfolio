using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class DoctorSpecialty
    {
        public DoctorSpecialty()
        {
            DoctorProfiles = new HashSet<DoctorProfile>();
        }

        public int SpecialtyId { get; set; }
        public string SpecialtyName { get; set; } = null!;
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<DoctorProfile> DoctorProfiles { get; set; }
    }
}
