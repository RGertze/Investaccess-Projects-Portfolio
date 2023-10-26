using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class StudentProgressReport
    {
        public StudentProgressReport()
        {
            StudentProgressReportAssessments = new HashSet<StudentProgressReportAssessment>();
            StudentProgressReportExamMarks = new HashSet<StudentProgressReportExamMark>();
        }

        public int Id { get; set; }
        public string StudentNumber { get; set; } = null!;
        public int CourseProgressReportId { get; set; }
        public decimal ExamMark { get; set; }

        public virtual CourseProgressReport CourseProgressReport { get; set; } = null!;
        public virtual Student StudentNumberNavigation { get; set; } = null!;
        public virtual ICollection<StudentProgressReportAssessment> StudentProgressReportAssessments { get; set; }
        public virtual ICollection<StudentProgressReportExamMark> StudentProgressReportExamMarks { get; set; }
    }
}
