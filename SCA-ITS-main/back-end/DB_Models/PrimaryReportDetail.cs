using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class PrimaryReportDetail
    {
        public int Id { get; set; }
        public int ReportId { get; set; }
        public int? DaysAbsent { get; set; }
        public string? PersonaBriefComments { get; set; }
        public string? RegisterTeacher { get; set; }

        public virtual Report Report { get; set; } = null!;
    }
}
