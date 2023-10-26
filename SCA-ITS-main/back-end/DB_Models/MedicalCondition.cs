using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class MedicalCondition
    {
        public MedicalCondition()
        {
            StudentMedicalConditions = new HashSet<StudentMedicalCondition>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<StudentMedicalCondition> StudentMedicalConditions { get; set; }
    }
}
