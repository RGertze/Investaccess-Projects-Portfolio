using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class PatientProfileAccess
    {
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public int Status { get; set; }
        public string ApprovalCode { get; set; } = null!;

        public virtual DoctorProfile Doctor { get; set; } = null!;
        public virtual PatientProfile Patient { get; set; } = null!;
    }
}
