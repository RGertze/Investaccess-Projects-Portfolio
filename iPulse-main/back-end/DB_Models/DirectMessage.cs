using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class DirectMessage
    {
        public int Id { get; set; }
        public int FromId { get; set; }
        public int ToId { get; set; }
        public DateTime DateSent { get; set; }
        public ulong Seen { get; set; }
        public string Content { get; set; } = null!;
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserAccount From { get; set; } = null!;
        public virtual UserAccount To { get; set; } = null!;
    }
}
