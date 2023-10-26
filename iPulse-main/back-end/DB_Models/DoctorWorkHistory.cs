using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class DoctorWorkHistory
    {
        public int DoctorWorkHistoryId { get; set; }
        public int DoctorId { get; set; }
        public string CompanyName { get; set; } = null!;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Role { get; set; } = null!;
        public string Duties { get; set; } = null!;
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual DoctorProfile Doctor { get; set; } = null!;
    }
}
