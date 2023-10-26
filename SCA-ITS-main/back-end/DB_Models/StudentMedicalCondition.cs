using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class StudentMedicalCondition
    {
        public string StudentNumber { get; set; } = null!;
        public int MedicalId { get; set; }
        public int? _ { get; set; }

        public virtual MedicalCondition Medical { get; set; } = null!;
        public virtual Student StudentNumberNavigation { get; set; } = null!;
    }
}
