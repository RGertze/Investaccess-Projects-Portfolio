using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class DoctorEducation
    {
        public int DoctorEducationId { get; set; }
        public int DoctorId { get; set; }
        public string InstituteName { get; set; } = null!;
        public string QualificationName { get; set; } = null!;
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual DoctorProfile Doctor { get; set; } = null!;
    }
}
