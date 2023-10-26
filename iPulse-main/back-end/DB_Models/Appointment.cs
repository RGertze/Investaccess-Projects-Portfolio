using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class Appointment
    {
        public int AppointmentId { get; set; }
        public int SlotId { get; set; }
        public int PatientId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateOnly DateOf { get; set; }
        public int Status { get; set; }
        public string ConfirmationCode { get; set; } = null!;

        public virtual PatientProfile Patient { get; set; } = null!;
        public virtual AppointmentSlot Slot { get; set; } = null!;
    }
}
