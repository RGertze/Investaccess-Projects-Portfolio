using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class GeneratedReportFile
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public int ReportId { get; set; }
        public string? FilePath { get; set; }
        public int Status { get; set; }
        public string? FailureMessage { get; set; }

        public virtual ReportGenerationJob Job { get; set; } = null!;
        public virtual Report Report { get; set; } = null!;
    }
}
