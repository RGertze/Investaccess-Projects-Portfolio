using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class Parent
    {
        public Parent()
        {
            OtherParents = new HashSet<OtherParent>();
            ParentRegistrationFiles = new HashSet<ParentRegistrationFile>();
            ParentRegistrationPaymentFiles = new HashSet<ParentRegistrationPaymentFile>();
            Students = new HashSet<Student>();
        }

        public int UserId { get; set; }
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
        public string? SchoolDiscovery { get; set; }
        public string? ReasonForSchoolSelection { get; set; }
        public int RegistrationStage { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserAccount User { get; set; } = null!;
        public virtual ParentRegistrationStatus ParentRegistrationStatus { get; set; } = null!;
        public virtual ICollection<OtherParent> OtherParents { get; set; }
        public virtual ICollection<ParentRegistrationFile> ParentRegistrationFiles { get; set; }
        public virtual ICollection<ParentRegistrationPaymentFile> ParentRegistrationPaymentFiles { get; set; }
        public virtual ICollection<Student> Students { get; set; }
    }
}
