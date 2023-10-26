using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class ContactDetail
    {
        public int Id { get; set; }
        public int TypeId { get; set; }
        public string Content { get; set; } = null!;
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ContactDetailsType Type { get; set; } = null!;
    }
}
