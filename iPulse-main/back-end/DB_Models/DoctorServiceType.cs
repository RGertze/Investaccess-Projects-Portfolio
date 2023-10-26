using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class DoctorServiceType
    {
        public DoctorServiceType()
        {
            DoctorServices = new HashSet<DoctorService>();
        }

        public int DoctorServiceTypeId { get; set; }
        public string DoctorServiceTypeName { get; set; } = null!;
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<DoctorService> DoctorServices { get; set; }
    }
}
