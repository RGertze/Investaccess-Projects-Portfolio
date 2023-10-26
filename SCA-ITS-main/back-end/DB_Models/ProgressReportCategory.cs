using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class ProgressReportCategory
    {
        public ProgressReportCategory()
        {
            ProgressReportAssessments = new HashSet<ProgressReportAssessment>();
        }

        public int Id { get; set; }
        public int ProgressReportId { get; set; }
        public string Name { get; set; } = null!;
        public decimal Weight { get; set; }

        public virtual ProgressReportTemplate ProgressReport { get; set; } = null!;
        public virtual ICollection<ProgressReportAssessment> ProgressReportAssessments { get; set; }
    }
}
