using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class DevelopmentGroup
    {
        public DevelopmentGroup()
        {
            DevelopmentCategories = new HashSet<DevelopmentCategory>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<DevelopmentCategory> DevelopmentCategories { get; set; }
    }
}
