using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class NonScaSibling
    {
        public int Id { get; set; }
        public string StudentNumber { get; set; } = null!;
        public string Name { get; set; } = null!;
        public int Age { get; set; }

        public virtual Student StudentNumberNavigation { get; set; } = null!;
    }
}
