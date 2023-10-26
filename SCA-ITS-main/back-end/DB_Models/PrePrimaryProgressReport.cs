using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class PrePrimaryProgressReport
    {
        public PrePrimaryProgressReport()
        {
            StudentPrePrimaryProgressReports = new HashSet<StudentPrePrimaryProgressReport>();
        }

        public int Id { get; set; }
        public int Year { get; set; }
        public int Terms { get; set; }

        public virtual ICollection<StudentPrePrimaryProgressReport> StudentPrePrimaryProgressReports { get; set; }
    }
}
