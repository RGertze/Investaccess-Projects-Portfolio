using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class Notification
    {
        public int NotificationId { get; set; }
        public int TypeId { get; set; }
        public int UserId { get; set; }
        public DateTime DateSent { get; set; }
        public ulong Seen { get; set; }
        public string Content { get; set; } = null!;

        public virtual NotificationType Type { get; set; } = null!;
        public virtual UserAccount User { get; set; } = null!;
    }
}
