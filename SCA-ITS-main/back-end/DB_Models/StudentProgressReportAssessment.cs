using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class StudentProgressReportAssessment
    {
        public int Id { get; set; }
        public int StudentProgressReportId { get; set; }
        public int ProgressReportAssessmentId { get; set; }
        public int Term { get; set; }
        public decimal Mark { get; set; }

        public virtual ProgressReportAssessment ProgressReportAssessment { get; set; } = null!;
        public virtual StudentProgressReport StudentProgressReport { get; set; } = null!;
    }
}
