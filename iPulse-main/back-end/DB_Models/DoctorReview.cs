using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class DoctorReview
    {
        public int ReviewId { get; set; }
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public string? Comment { get; set; }
        public decimal? Rating { get; set; }
        public DateTime? ReviewDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual DoctorProfile Doctor { get; set; } = null!;
        public virtual PatientProfile Patient { get; set; } = null!;
    }
}
