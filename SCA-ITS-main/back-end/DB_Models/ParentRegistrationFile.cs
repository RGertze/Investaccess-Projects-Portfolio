using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class ParentRegistrationFile
    {
        public string FilePath { get; set; } = null!;
        public int RequiredId { get; set; }
        public int UserId { get; set; }
        public string? Name { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual RequiredRegistrationDocument Required { get; set; } = null!;
        public virtual Parent User { get; set; } = null!;
    }
}
