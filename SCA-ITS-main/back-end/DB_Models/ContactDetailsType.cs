using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class ContactDetailsType
    {
        public ContactDetailsType()
        {
            ContactDetails = new HashSet<ContactDetail>();
        }

        public int TypeId { get; set; }
        public string TypeName { get; set; } = null!;
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<ContactDetail> ContactDetails { get; set; }
    }
}
