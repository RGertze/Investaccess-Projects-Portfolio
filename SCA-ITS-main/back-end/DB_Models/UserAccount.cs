using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class UserAccount
    {
        public UserAccount()
        {
            CourseStaffs = new HashSet<CourseStaff>();
        }

        public int UserId { get; set; }
        public int UserTypeId { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? ProfilePicPath { get; set; }
        public string ConfirmationCode { get; set; } = null!;
        public ulong IsConfirmed { get; set; }
        public ulong IsActive { get; set; }
        public ulong IsApproved { get; set; }
        public string? RefreshToken { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? LastLogin { get; set; }

        public virtual UserType UserType { get; set; } = null!;
        public virtual Parent Parent { get; set; } = null!;
        public virtual ParentFinancialStatement ParentFinancialStatement { get; set; } = null!;
        public virtual ICollection<CourseStaff> CourseStaffs { get; set; }
    }
}
