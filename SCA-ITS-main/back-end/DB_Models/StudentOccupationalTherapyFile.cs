using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class StudentOccupationalTherapyFile
    {
        public string FilePath { get; set; } = null!;
        public string FileName { get; set; } = null!;
        public string StudentNumber { get; set; } = null!;

        public virtual Student StudentNumberNavigation { get; set; } = null!;
    }
}
