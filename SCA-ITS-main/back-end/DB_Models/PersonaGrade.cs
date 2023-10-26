using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class PersonaGrade
    {
        public int Id { get; set; }
        public int ReportId { get; set; }
        public int PersonaId { get; set; }
        public int Term { get; set; }
        public string Grade { get; set; } = null!;

        public virtual Persona Persona { get; set; } = null!;
        public virtual Report Report { get; set; } = null!;
    }
}
