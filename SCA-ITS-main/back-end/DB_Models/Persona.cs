using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class Persona
    {
        public Persona()
        {
            PersonaGrades = new HashSet<PersonaGrade>();
        }

        public int Id { get; set; }
        public int PersonaCategoryId { get; set; }
        public string Name { get; set; } = null!;

        public virtual PersonaCategory PersonaCategory { get; set; } = null!;
        public virtual ICollection<PersonaGrade> PersonaGrades { get; set; }
    }
}
