using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class Course
    {
        public Course()
        {
            CourseProgressReports = new HashSet<CourseProgressReport>();
            CourseRemarks = new HashSet<CourseRemark>();
            CourseStaffs = new HashSet<CourseStaff>();
            CourseStudents = new HashSet<CourseStudent>();
        }

        public string Id { get; set; } = null!;
        public int MoodleId { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; } = null!;
        public int Grade { get; set; }
        public int TypeId { get; set; }
        public ulong IsPromotional { get; set; }

        public virtual CourseCategory Category { get; set; } = null!;
        public virtual CourseType Type { get; set; } = null!;
        public virtual ICollection<CourseProgressReport> CourseProgressReports { get; set; }
        public virtual ICollection<CourseRemark> CourseRemarks { get; set; }
        public virtual ICollection<CourseStaff> CourseStaffs { get; set; }
        public virtual ICollection<CourseStudent> CourseStudents { get; set; }
    }
}
