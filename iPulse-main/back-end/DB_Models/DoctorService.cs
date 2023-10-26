using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class DoctorService
    {
        public int DoctorId { get; set; }
        public int DoctorServiceTypeId { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual DoctorProfile Doctor { get; set; } = null!;
        public virtual DoctorServiceType DoctorServiceType { get; set; } = null!;
    }
}
