using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class PatientDoctor
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public int TypeId { get; set; }
        public int Status { get; set; }
        public string ApprovalCode { get; set; } = null!;
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual DoctorProfile Doctor { get; set; } = null!;
        public virtual PatientProfile Patient { get; set; } = null!;
        public virtual PatientDoctorType Type { get; set; } = null!;
    }
}
