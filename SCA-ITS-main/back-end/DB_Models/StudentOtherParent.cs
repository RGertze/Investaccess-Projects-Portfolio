using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class StudentOtherParent
    {
        public string StudentNumber { get; set; } = null!;
        public int ParentId { get; set; }
        public int? _ { get; set; }

        public virtual OtherParent Parent { get; set; } = null!;
        public virtual Student StudentNumberNavigation { get; set; } = null!;
    }
}
