using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class DevelopmentAssessment
    {
        public DevelopmentAssessment()
        {
            DevelopmentAssessmentGrades = new HashSet<DevelopmentAssessmentGrade>();
        }

        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; } = null!;

        public virtual DevelopmentCategory Category { get; set; } = null!;
        public virtual ICollection<DevelopmentAssessmentGrade> DevelopmentAssessmentGrades { get; set; }
    }
}
