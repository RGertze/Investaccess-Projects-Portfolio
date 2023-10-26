using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class DevelopmentAssessmentGrade
    {
        public int Id { get; set; }
        public int StudentProgressReportId { get; set; }
        public int AssessmentId { get; set; }
        public int Term { get; set; }
        public string Grade { get; set; } = null!;

        public virtual DevelopmentAssessment Assessment { get; set; } = null!;
        public virtual StudentPrePrimaryProgressReport StudentProgressReport { get; set; } = null!;
    }
}
