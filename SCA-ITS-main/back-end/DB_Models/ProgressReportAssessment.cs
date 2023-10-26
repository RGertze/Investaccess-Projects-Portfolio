using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class ProgressReportAssessment
    {
        public ProgressReportAssessment()
        {
            StudentProgressReportAssessments = new HashSet<StudentProgressReportAssessment>();
        }

        public int Id { get; set; }
        public int ProgressReportCategoryId { get; set; }
        public string Name { get; set; } = null!;
        public decimal MarksAvailable { get; set; }

        public virtual ProgressReportCategory ProgressReportCategory { get; set; } = null!;
        public virtual ICollection<StudentProgressReportAssessment> StudentProgressReportAssessments { get; set; }
    }
}
