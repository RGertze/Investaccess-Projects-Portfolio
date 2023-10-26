using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class CourseRemark
    {
        public int Id { get; set; }
        public int ReportId { get; set; }
        public string CourseId { get; set; } = null!;
        public string Remark { get; set; } = null!;
        public string Initials { get; set; } = null!;

        public virtual Course Course { get; set; } = null!;
        public virtual Report Report { get; set; } = null!;
    }
}
