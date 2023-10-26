using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class NotificationType
    {
        public NotificationType()
        {
            Notifications = new HashSet<Notification>();
        }

        public int TypeId { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<Notification> Notifications { get; set; }
    }
}
