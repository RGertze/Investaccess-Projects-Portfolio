using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class StudentProgressReportExamMark
    {
        public int Id { get; set; }
        public int StudentProgressReportId { get; set; }
        public int Term { get; set; }
        public decimal Mark { get; set; }

        public virtual StudentProgressReport StudentProgressReport { get; set; } = null!;
    }
}
