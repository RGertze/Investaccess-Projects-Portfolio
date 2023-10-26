using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class PersonaCategory
    {
        public PersonaCategory()
        {
            Personas = new HashSet<Persona>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<Persona> Personas { get; set; }
    }
}
