using System;
using System.Collections.Generic;

namespace iPulse_back_end.DB_Models
{
    public partial class Gender
    {
        public Gender()
        {
            PatientProfiles = new HashSet<PatientProfile>();
        }

        public int GenderId { get; set; }
        public string? GenderName { get; set; }

        public virtual ICollection<PatientProfile> PatientProfiles { get; set; }
    }
}
