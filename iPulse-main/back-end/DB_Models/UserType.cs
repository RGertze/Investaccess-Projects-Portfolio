using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class UserType
    {
        public UserType()
        {
            UserAccounts = new HashSet<UserAccount>();
        }

        public int UserTypeId { get; set; }
        public string UserTypeName { get; set; } = null!;
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<UserAccount> UserAccounts { get; set; }
    }
}
