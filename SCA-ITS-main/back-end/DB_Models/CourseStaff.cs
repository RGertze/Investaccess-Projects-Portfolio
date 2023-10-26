using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class CourseStaff
    {
        public string CourseId { get; set; } = null!;
        public int StaffId { get; set; }
        public int? _ { get; set; }

        public virtual Course Course { get; set; } = null!;
        public virtual UserAccount Staff { get; set; } = null!;
    }
}
