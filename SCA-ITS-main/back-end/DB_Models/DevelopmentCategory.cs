using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class DevelopmentCategory
    {
        public DevelopmentCategory()
        {
            DevelopmentAssessments = new HashSet<DevelopmentAssessment>();
        }

        public int Id { get; set; }
        public int GroupId { get; set; }
        public string Name { get; set; } = null!;

        public virtual DevelopmentGroup Group { get; set; } = null!;
        public virtual ICollection<DevelopmentAssessment> DevelopmentAssessments { get; set; }
    }
}
