using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class OtherParent
    {
        public OtherParent()
        {
            StudentOtherParents = new HashSet<StudentOtherParent>();
        }

        public int Id { get; set; }
        public int MainParentId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? IdNumber { get; set; }
        public string? Employer { get; set; }
        public string? Occupation { get; set; }
        public decimal? MonthlyIncome { get; set; }
        public string? WorkingHours { get; set; }
        public string? SpecialistSkillsHobbies { get; set; }
        public string? TelephoneWork { get; set; }
        public string? TelephoneHome { get; set; }
        public string? Fax { get; set; }
        public string? CellNumber { get; set; }
        public string? PostalAddress { get; set; }
        public string? ResidentialAddress { get; set; }
        public string? MaritalStatus { get; set; }

        public virtual Parent MainParent { get; set; } = null!;
        public virtual ICollection<StudentOtherParent> StudentOtherParents { get; set; }
    }
}
