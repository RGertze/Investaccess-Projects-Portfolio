using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class Report
    {
        public Report()
        {
            CourseRemarks = new HashSet<CourseRemark>();
            GeneratedReportFiles = new HashSet<GeneratedReportFile>();
            PersonaGrades = new HashSet<PersonaGrade>();
            PrePrimaryReportDetails = new HashSet<PrePrimaryReportDetail>();
            PrimaryReportDetails = new HashSet<PrimaryReportDetail>();
        }

        public int Id { get; set; }
        public int ReportTypeId { get; set; }
        public int ReportGroupId { get; set; }
        public string StudentNumber { get; set; } = null!;

        public virtual ReportGroup ReportGroup { get; set; } = null!;
        public virtual ReportType ReportType { get; set; } = null!;
        public virtual Student StudentNumberNavigation { get; set; } = null!;
        public virtual ICollection<CourseRemark> CourseRemarks { get; set; }
        public virtual ICollection<GeneratedReportFile> GeneratedReportFiles { get; set; }
        public virtual ICollection<PersonaGrade> PersonaGrades { get; set; }
        public virtual ICollection<PrePrimaryReportDetail> PrePrimaryReportDetails { get; set; }
        public virtual ICollection<PrimaryReportDetail> PrimaryReportDetails { get; set; }
    }
}
