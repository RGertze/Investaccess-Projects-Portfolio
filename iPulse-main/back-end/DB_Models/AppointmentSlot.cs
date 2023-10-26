using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class AppointmentSlot
    {
        public AppointmentSlot()
        {
            Appointments = new HashSet<Appointment>();
        }

        public int SlotId { get; set; }
        public int DoctorId { get; set; }
        public int SlotDay { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }

        public virtual DoctorProfile Doctor { get; set; } = null!;
        public virtual ICollection<Appointment> Appointments { get; set; }
    }
}
