using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class ReportGenerationJob
    {
        public ReportGenerationJob()
        {
            GeneratedReportFiles = new HashSet<GeneratedReportFile>();
        }

        public int Id { get; set; }
        public int ReportGroupId { get; set; }
        public int? Term { get; set; }
        public DateOnly SchoolReOpens { get; set; }
        public int? Status { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual ReportGroup ReportGroup { get; set; } = null!;
        public virtual ICollection<GeneratedReportFile> GeneratedReportFiles { get; set; }
    }
}
