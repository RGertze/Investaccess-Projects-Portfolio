using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class Student
    {
        public Student()
        {
            CourseStudents = new HashSet<CourseStudent>();
            NonScaSiblings = new HashSet<NonScaSibling>();
            Reports = new HashSet<Report>();
            StudentMedicalConditions = new HashSet<StudentMedicalCondition>();
            StudentOccupationalTherapyFiles = new HashSet<StudentOccupationalTherapyFile>();
            StudentOtherParents = new HashSet<StudentOtherParent>();
            StudentPrePrimaryProgressReports = new HashSet<StudentPrePrimaryProgressReport>();
            StudentProgressReports = new HashSet<StudentProgressReport>();
            StudentRegistrationFiles = new HashSet<StudentRegistrationFile>();
        }

        public string StudentNumber { get; set; } = null!;
        public int ParentId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public int Grade { get; set; }
        public DateOnly Dob { get; set; }
        public int? Age { get; set; }
        public int? Gender { get; set; }
        public string? Citizenship { get; set; }
        public string? StudyPermit { get; set; }
        public string? HomeLanguage { get; set; }
        public string? PostalAddress { get; set; }
        public string? ResidentialAddress { get; set; }
        public string? TelephoneHome { get; set; }
        public string? TelephoneOther { get; set; }
        public string? CurrentChurch { get; set; }
        public string? CurrentChurchAddress { get; set; }
        public string? Pastor { get; set; }
        public string? PastorTelephone { get; set; }
        public DateOnly? FatherConfirmationDate { get; set; }
        public DateOnly? MotherConfirmationDate { get; set; }
        public DateOnly? BaptismDate { get; set; }
        public int? CurrentGrade { get; set; }
        public string? LastSchoolAttended { get; set; }
        public string? NameOfPrincipal { get; set; }
        public string? SchoolAddress { get; set; }
        public string? StudentsStrengths { get; set; }
        public string? TalentsAndInterests { get; set; }
        public string? LearningDifficulties { get; set; }
        public string? DisiplinaryDifficulties { get; set; }
        public string? LegalDifficulties { get; set; }
        public string? AcademicLevel { get; set; }
        public string? AcademicFailureAssessment { get; set; }
        public string? FamilyDoctor { get; set; }
        public string? DoctorTelephone { get; set; }
        public string? OtherMedicalConditions { get; set; }
        public DateOnly? GeneralHearingTestDate { get; set; }
        public DateOnly? GeneralVisionTestDate { get; set; }
        public DateOnly? TuberculosisTestDate { get; set; }
        public ulong? IsShy { get; set; }
        public ulong? BitesFingerNails { get; set; }
        public ulong? SucksThumb { get; set; }
        public ulong? HasExcessiveFears { get; set; }
        public ulong? LikesSchool { get; set; }
        public ulong? PlaysWellWithOthers { get; set; }
        public ulong? EatsBreakfastRegularly { get; set; }
        public string? Bedtime { get; set; }
        public string? RisingTime { get; set; }
        public string? DisabilityDueToDiseaseOrAccident { get; set; }
        public string? ChronicMedication { get; set; }
        public int RegistrationStage { get; set; }
        public string? RejectionMessage { get; set; }
        public ulong ApprovalRequested { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual Parent Parent { get; set; } = null!;
        public virtual StudentRegistrationStatus StudentRegistrationStatus { get; set; } = null!;
        public virtual ICollection<CourseStudent> CourseStudents { get; set; }
        public virtual ICollection<NonScaSibling> NonScaSiblings { get; set; }
        public virtual ICollection<Report> Reports { get; set; }
        public virtual ICollection<StudentMedicalCondition> StudentMedicalConditions { get; set; }
        public virtual ICollection<StudentOccupationalTherapyFile> StudentOccupationalTherapyFiles { get; set; }
        public virtual ICollection<StudentOtherParent> StudentOtherParents { get; set; }
        public virtual ICollection<StudentPrePrimaryProgressReport> StudentPrePrimaryProgressReports { get; set; }
        public virtual ICollection<StudentProgressReport> StudentProgressReports { get; set; }
        public virtual ICollection<StudentRegistrationFile> StudentRegistrationFiles { get; set; }
    }
}
