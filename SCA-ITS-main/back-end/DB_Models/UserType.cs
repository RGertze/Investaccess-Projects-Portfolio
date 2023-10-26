using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class UserType
    {
        public UserType()
        {
            RequiredRegistrationDocuments = new HashSet<RequiredRegistrationDocument>();
            UserAccounts = new HashSet<UserAccount>();
        }

        public int UserTypeId { get; set; }
        public string UserTypeName { get; set; } = null!;
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<RequiredRegistrationDocument> RequiredRegistrationDocuments { get; set; }
        public virtual ICollection<UserAccount> UserAccounts { get; set; }
    }
}
