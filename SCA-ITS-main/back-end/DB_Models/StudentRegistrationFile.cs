using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class StudentRegistrationFile
    {
        public string FilePath { get; set; } = null!;
        public int RequiredId { get; set; }
        public string StudentNumber { get; set; } = null!;
        public string? Name { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual RequiredRegistrationDocument Required { get; set; } = null!;
        public virtual Student StudentNumberNavigation { get; set; } = null!;
    }
}
