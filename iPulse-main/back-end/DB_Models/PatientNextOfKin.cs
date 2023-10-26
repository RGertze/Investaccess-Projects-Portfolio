using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class PatientNextOfKin
    {
        public int PatientNextOfKinId { get; set; }
        public int PatientId { get; set; }
        public string? FullName { get; set; }
        public string? Cellphone { get; set; }
        public string? Email { get; set; }
        public string? ResidentialAddress { get; set; }
        public string? Relationship { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual PatientProfile Patient { get; set; } = null!;
    }
}
