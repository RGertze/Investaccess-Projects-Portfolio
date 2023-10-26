using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class RequiredRegistrationDocument
    {
        public RequiredRegistrationDocument()
        {
            ParentRegistrationFiles = new HashSet<ParentRegistrationFile>();
            StudentRegistrationFiles = new HashSet<StudentRegistrationFile>();
        }

        public int Id { get; set; }
        public int UserTypeId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserType UserType { get; set; } = null!;
        public virtual ICollection<ParentRegistrationFile> ParentRegistrationFiles { get; set; }
        public virtual ICollection<StudentRegistrationFile> StudentRegistrationFiles { get; set; }
    }
}
