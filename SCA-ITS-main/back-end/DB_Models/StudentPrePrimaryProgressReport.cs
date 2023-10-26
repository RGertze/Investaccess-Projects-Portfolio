using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class StudentPrePrimaryProgressReport
    {
        public StudentPrePrimaryProgressReport()
        {
            DevelopmentAssessmentGrades = new HashSet<DevelopmentAssessmentGrade>();
        }

        public int Id { get; set; }
        public string StudentNumber { get; set; } = null!;
        public int ProgressReportId { get; set; }

        public virtual PrePrimaryProgressReport ProgressReport { get; set; } = null!;
        public virtual Student StudentNumberNavigation { get; set; } = null!;
        public virtual ICollection<DevelopmentAssessmentGrade> DevelopmentAssessmentGrades { get; set; }
    }
}
