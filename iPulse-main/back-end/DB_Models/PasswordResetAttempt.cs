using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class PasswordResetAttempt
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ConfirmationCode { get; set; } = null!;
        public string IpAddress { get; set; } = null!;
        public DateTime Expires { get; set; }
        public ulong Confirmed { get; set; }
        public ulong Used { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
