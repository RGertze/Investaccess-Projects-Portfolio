using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class CourseCategory
    {
        public CourseCategory()
        {
            Courses = new HashSet<Course>();
        }

        public int Id { get; set; }
        public int MoodleId { get; set; }
        public int ParentCategoryId { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;

        public virtual ICollection<Course> Courses { get; set; }
    }
}
