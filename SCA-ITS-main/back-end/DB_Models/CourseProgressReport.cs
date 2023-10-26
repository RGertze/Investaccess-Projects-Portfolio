using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class CourseProgressReport
    {
        public CourseProgressReport()
        {
            StudentProgressReports = new HashSet<StudentProgressReport>();
        }

        public int Id { get; set; }
        public short Year { get; set; }
        public string CourseId { get; set; } = null!;
        public int ProgressReportId { get; set; }
        public int NumberOfTerms { get; set; }

        public virtual Course Course { get; set; } = null!;
        public virtual ProgressReportTemplate ProgressReport { get; set; } = null!;
        public virtual ICollection<StudentProgressReport> StudentProgressReports { get; set; }
    }
}
