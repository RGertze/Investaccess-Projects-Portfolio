using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class ReportGroup
    {
        public ReportGroup()
        {
            ReportGenerationJobs = new HashSet<ReportGenerationJob>();
            Reports = new HashSet<Report>();
        }

        public int Id { get; set; }
        public short Year { get; set; }
        public int Terms { get; set; }

        public virtual ICollection<ReportGenerationJob> ReportGenerationJobs { get; set; }
        public virtual ICollection<Report> Reports { get; set; }
    }
}
