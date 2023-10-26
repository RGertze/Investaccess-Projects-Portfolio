using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class CourseStudent
    {
        public string CourseId { get; set; } = null!;
        public string StudentNumber { get; set; } = null!;
        public int? _ { get; set; }

        public virtual Course Course { get; set; } = null!;
        public virtual Student StudentNumberNavigation { get; set; } = null!;
    }
}
