using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class ProgressReportTemplate
    {
        public ProgressReportTemplate()
        {
            CourseProgressReports = new HashSet<CourseProgressReport>();
            ProgressReportCategories = new HashSet<ProgressReportCategory>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal ExamMarksAvailable { get; set; }
        public decimal ExamWeight { get; set; }

        public virtual ICollection<CourseProgressReport> CourseProgressReports { get; set; }
        public virtual ICollection<ProgressReportCategory> ProgressReportCategories { get; set; }
    }
}
