using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class UserAccount
    {
        public UserAccount()
        {
            DirectMessageFroms = new HashSet<DirectMessage>();
            DirectMessageTos = new HashSet<DirectMessage>();
            Notifications = new HashSet<Notification>();
            Receptionists = new HashSet<Receptionist>();
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
        public string? RefreshToken { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserType UserType { get; set; } = null!;
        public virtual DoctorProfile DoctorProfile { get; set; } = null!;
        public virtual PatientProfile PatientProfile { get; set; } = null!;
        public virtual ICollection<DirectMessage> DirectMessageFroms { get; set; }
        public virtual ICollection<DirectMessage> DirectMessageTos { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
        public virtual ICollection<Receptionist> Receptionists { get; set; }
    }
}
