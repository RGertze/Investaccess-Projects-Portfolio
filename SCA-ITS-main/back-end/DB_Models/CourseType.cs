using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class CourseType
    {
        public CourseType()
        {
            Courses = new HashSet<Course>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<Course> Courses { get; set; }
    }
}
