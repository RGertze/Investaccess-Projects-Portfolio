using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class PatientDoctorType
    {
        public PatientDoctorType()
        {
            PatientDoctors = new HashSet<PatientDoctor>();
        }

        public int TypeId { get; set; }
        public string TypeName { get; set; } = null!;
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<PatientDoctor> PatientDoctors { get; set; }
    }
}
