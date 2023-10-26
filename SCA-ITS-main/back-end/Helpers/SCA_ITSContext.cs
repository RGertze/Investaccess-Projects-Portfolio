using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class SCA_ITSContext : DbContext
    {
        public SCA_ITSContext()
        {
        }

        public SCA_ITSContext(DbContextOptions<SCA_ITSContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ContactDetail> ContactDetails { get; set; } = null!;
        public virtual DbSet<ContactDetailsType> ContactDetailsTypes { get; set; } = null!;
        public virtual DbSet<Course> Courses { get; set; } = null!;
        public virtual DbSet<CourseCategory> CourseCategories { get; set; } = null!;
        public virtual DbSet<CourseProgressReport> CourseProgressReports { get; set; } = null!;
        public virtual DbSet<CourseRemark> CourseRemarks { get; set; } = null!;
        public virtual DbSet<CourseStaff> CourseStaffs { get; set; } = null!;
        public virtual DbSet<CourseStudent> CourseStudents { get; set; } = null!;
        public virtual DbSet<CourseType> CourseTypes { get; set; } = null!;
        public virtual DbSet<DevelopmentAssessment> DevelopmentAssessments { get; set; } = null!;
        public virtual DbSet<DevelopmentAssessmentGrade> DevelopmentAssessmentGrades { get; set; } = null!;
        public virtual DbSet<DevelopmentCategory> DevelopmentCategories { get; set; } = null!;
        public virtual DbSet<DevelopmentGroup> DevelopmentGroups { get; set; } = null!;
        public virtual DbSet<FeesForGrade> FeesForGrades { get; set; } = null!;
        public virtual DbSet<FileToDelete> FileToDeletes { get; set; } = null!;
        public virtual DbSet<GeneratedReportFile> GeneratedReportFiles { get; set; } = null!;
        public virtual DbSet<MedicalCondition> MedicalConditions { get; set; } = null!;
        public virtual DbSet<NonScaSibling> NonScaSiblings { get; set; } = null!;
        public virtual DbSet<OtherParent> OtherParents { get; set; } = null!;
        public virtual DbSet<Parent> Parents { get; set; } = null!;
        public virtual DbSet<ParentFinancialStatement> ParentFinancialStatements { get; set; } = null!;
        public virtual DbSet<ParentRegistrationFile> ParentRegistrationFiles { get; set; } = null!;
        public virtual DbSet<ParentRegistrationPaymentFile> ParentRegistrationPaymentFiles { get; set; } = null!;
        public virtual DbSet<ParentRegistrationStatus> ParentRegistrationStatuses { get; set; } = null!;
        public virtual DbSet<Persona> Personas { get; set; } = null!;
        public virtual DbSet<PersonaCategory> PersonaCategories { get; set; } = null!;
        public virtual DbSet<PersonaGrade> PersonaGrades { get; set; } = null!;
        public virtual DbSet<PrePrimaryProgressReport> PrePrimaryProgressReports { get; set; } = null!;
        public virtual DbSet<PrePrimaryReportDetail> PrePrimaryReportDetails { get; set; } = null!;
        public virtual DbSet<PrimaryReportDetail> PrimaryReportDetails { get; set; } = null!;
        public virtual DbSet<ProgressReportAssessment> ProgressReportAssessments { get; set; } = null!;
        public virtual DbSet<ProgressReportCategory> ProgressReportCategories { get; set; } = null!;
        public virtual DbSet<ProgressReportTemplate> ProgressReportTemplates { get; set; } = null!;
        public virtual DbSet<ProofOfDeposit> ProofOfDeposits { get; set; } = null!;
        public virtual DbSet<Report> Reports { get; set; } = null!;
        public virtual DbSet<ReportGenerationJob> ReportGenerationJobs { get; set; } = null!;
        public virtual DbSet<ReportGroup> ReportGroups { get; set; } = null!;
        public virtual DbSet<ReportType> ReportTypes { get; set; } = null!;
        public virtual DbSet<RequiredRegistrationDocument> RequiredRegistrationDocuments { get; set; } = null!;
        public virtual DbSet<StatementItem> StatementItems { get; set; } = null!;
        public virtual DbSet<Student> Students { get; set; } = null!;
        public virtual DbSet<StudentMedicalCondition> StudentMedicalConditions { get; set; } = null!;
        public virtual DbSet<StudentOccupationalTherapyFile> StudentOccupationalTherapyFiles { get; set; } = null!;
        public virtual DbSet<StudentOtherParent> StudentOtherParents { get; set; } = null!;
        public virtual DbSet<StudentPrePrimaryProgressReport> StudentPrePrimaryProgressReports { get; set; } = null!;
        public virtual DbSet<StudentProgressReport> StudentProgressReports { get; set; } = null!;
        public virtual DbSet<StudentProgressReportAssessment> StudentProgressReportAssessments { get; set; } = null!;
        public virtual DbSet<StudentProgressReportExamMark> StudentProgressReportExamMarks { get; set; } = null!;
        public virtual DbSet<StudentRegistrationFile> StudentRegistrationFiles { get; set; } = null!;
        public virtual DbSet<StudentRegistrationStatus> StudentRegistrationStatuses { get; set; } = null!;
        public virtual DbSet<UserAccount> UserAccounts { get; set; } = null!;
        public virtual DbSet<UserType> UserTypes { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySql("server=localhost;port=3307;database=SCA_ITS;user=dev;password=Dev@1234;persist security info=False;connect timeout=300", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.31-mysql"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("utf8mb4_0900_ai_ci")
                .HasCharSet("utf8mb4");

            modelBuilder.Entity<ContactDetail>(entity =>
            {
                entity.ToTable("Contact_Details");

                entity.HasIndex(e => e.TypeId, "Type_Id");

                entity.Property(e => e.Content).HasMaxLength(100);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.TypeId).HasColumnName("Type_Id");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.ContactDetails)
                    .HasForeignKey(d => d.TypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Contact_Details_ibfk_1");
            });

            modelBuilder.Entity<ContactDetailsType>(entity =>
            {
                entity.HasKey(e => e.TypeId)
                    .HasName("PRIMARY");

                entity.ToTable("Contact_Details_Type");

                entity.Property(e => e.TypeId).HasColumnName("Type_Id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.TypeName)
                    .HasMaxLength(100)
                    .HasColumnName("Type_Name");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");
            });

            modelBuilder.Entity<Course>(entity =>
            {
                entity.ToTable("Course");

                entity.HasIndex(e => e.CategoryId, "Category_Id");

                entity.HasIndex(e => e.TypeId, "Type_Id");

                entity.Property(e => e.Id).HasMaxLength(400);

                entity.Property(e => e.CategoryId).HasColumnName("Category_Id");

                entity.Property(e => e.IsPromotional).HasColumnType("bit(1)");

                entity.Property(e => e.MoodleId).HasColumnName("Moodle_Id");

                entity.Property(e => e.Name).HasMaxLength(2000);

                entity.Property(e => e.TypeId).HasColumnName("Type_Id");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Courses)
                    .HasPrincipalKey(p => p.MoodleId)
                    .HasForeignKey(d => d.CategoryId)
                    .HasConstraintName("Course_ibfk_1");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.Courses)
                    .HasForeignKey(d => d.TypeId)
                    .HasConstraintName("Course_ibfk_2");
            });

            modelBuilder.Entity<CourseCategory>(entity =>
            {
                entity.ToTable("Course_Category");

                entity.HasIndex(e => e.MoodleId, "Moodle_Id")
                    .IsUnique();

                entity.Property(e => e.Description).HasColumnType("text");

                entity.Property(e => e.MoodleId).HasColumnName("Moodle_Id");

                entity.Property(e => e.Name).HasMaxLength(400);

                entity.Property(e => e.ParentCategoryId).HasColumnName("Parent_Category_Id");
            });

            modelBuilder.Entity<CourseProgressReport>(entity =>
            {
                entity.ToTable("Course_Progress_Report");

                entity.HasIndex(e => new { e.CourseId, e.Year }, "Course_Id")
                    .IsUnique();

                entity.HasIndex(e => e.ProgressReportId, "Progress_Report_Id");

                entity.Property(e => e.CourseId)
                    .HasMaxLength(400)
                    .HasColumnName("Course_Id");

                entity.Property(e => e.NumberOfTerms).HasColumnName("Number_Of_Terms");

                entity.Property(e => e.ProgressReportId).HasColumnName("Progress_Report_Id");

                entity.Property(e => e.Year).HasColumnType("year");

                entity.HasOne(d => d.Course)
                    .WithMany(p => p.CourseProgressReports)
                    .HasForeignKey(d => d.CourseId)
                    .HasConstraintName("Course_Progress_Report_ibfk_2");

                entity.HasOne(d => d.ProgressReport)
                    .WithMany(p => p.CourseProgressReports)
                    .HasForeignKey(d => d.ProgressReportId)
                    .HasConstraintName("Course_Progress_Report_ibfk_1");
            });

            modelBuilder.Entity<CourseRemark>(entity =>
            {
                entity.ToTable("Course_Remark");

                entity.HasIndex(e => e.CourseId, "Course_Id");

                entity.HasIndex(e => e.ReportId, "Report_Id");

                entity.Property(e => e.CourseId)
                    .HasMaxLength(400)
                    .HasColumnName("Course_Id");

                entity.Property(e => e.Initials).HasMaxLength(10);

                entity.Property(e => e.Remark).HasMaxLength(1000);

                entity.Property(e => e.ReportId).HasColumnName("Report_Id");

                entity.HasOne(d => d.Course)
                    .WithMany(p => p.CourseRemarks)
                    .HasForeignKey(d => d.CourseId)
                    .HasConstraintName("Course_Remark_ibfk_2");

                entity.HasOne(d => d.Report)
                    .WithMany(p => p.CourseRemarks)
                    .HasForeignKey(d => d.ReportId)
                    .HasConstraintName("Course_Remark_ibfk_1");
            });

            modelBuilder.Entity<CourseStaff>(entity =>
            {
                entity.HasKey(e => new { e.CourseId, e.StaffId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("Course_Staff");

                entity.HasIndex(e => e.StaffId, "Staff_Id");

                entity.Property(e => e.CourseId)
                    .HasMaxLength(400)
                    .HasColumnName("Course_Id");

                entity.Property(e => e.StaffId).HasColumnName("Staff_Id");

                entity.HasOne(d => d.Course)
                    .WithMany(p => p.CourseStaffs)
                    .HasForeignKey(d => d.CourseId)
                    .HasConstraintName("Course_Staff_ibfk_1");

                entity.HasOne(d => d.Staff)
                    .WithMany(p => p.CourseStaffs)
                    .HasForeignKey(d => d.StaffId)
                    .HasConstraintName("Course_Staff_ibfk_2");
            });

            modelBuilder.Entity<CourseStudent>(entity =>
            {
                entity.HasKey(e => new { e.CourseId, e.StudentNumber })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("Course_Student");

                entity.HasIndex(e => e.StudentNumber, "Student_Number");

                entity.Property(e => e.CourseId)
                    .HasMaxLength(400)
                    .HasColumnName("Course_Id");

                entity.Property(e => e.StudentNumber)
                    .HasMaxLength(150)
                    .HasColumnName("Student_Number");

                entity.HasOne(d => d.Course)
                    .WithMany(p => p.CourseStudents)
                    .HasForeignKey(d => d.CourseId)
                    .HasConstraintName("Course_Student_ibfk_1");

                entity.HasOne(d => d.StudentNumberNavigation)
                    .WithMany(p => p.CourseStudents)
                    .HasForeignKey(d => d.StudentNumber)
                    .HasConstraintName("Course_Student_ibfk_2");
            });

            modelBuilder.Entity<CourseType>(entity =>
            {
                entity.ToTable("Course_Type");

                entity.Property(e => e.Name).HasMaxLength(100);
            });

            modelBuilder.Entity<DevelopmentAssessment>(entity =>
            {
                entity.ToTable("Development_Assessment");

                entity.HasIndex(e => e.CategoryId, "Category_Id");

                entity.Property(e => e.CategoryId).HasColumnName("Category_Id");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.DevelopmentAssessments)
                    .HasForeignKey(d => d.CategoryId)
                    .HasConstraintName("Development_Assessment_ibfk_1");
            });

            modelBuilder.Entity<DevelopmentAssessmentGrade>(entity =>
            {
                entity.ToTable("Development_Assessment_Grade");

                entity.HasIndex(e => e.AssessmentId, "Assessment_Id");

                entity.HasIndex(e => e.StudentProgressReportId, "StudentProgressReportId");

                entity.Property(e => e.AssessmentId).HasColumnName("Assessment_Id");

                entity.Property(e => e.Grade).HasMaxLength(10);

                entity.HasOne(d => d.Assessment)
                    .WithMany(p => p.DevelopmentAssessmentGrades)
                    .HasForeignKey(d => d.AssessmentId)
                    .HasConstraintName("Development_Assessment_Grade_ibfk_2");

                entity.HasOne(d => d.StudentProgressReport)
                    .WithMany(p => p.DevelopmentAssessmentGrades)
                    .HasForeignKey(d => d.StudentProgressReportId)
                    .HasConstraintName("Development_Assessment_Grade_ibfk_1");
            });

            modelBuilder.Entity<DevelopmentCategory>(entity =>
            {
                entity.ToTable("Development_Category");

                entity.HasIndex(e => e.GroupId, "Group_Id");

                entity.Property(e => e.GroupId).HasColumnName("Group_Id");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.DevelopmentCategories)
                    .HasForeignKey(d => d.GroupId)
                    .HasConstraintName("Development_Category_ibfk_1");
            });

            modelBuilder.Entity<DevelopmentGroup>(entity =>
            {
                entity.ToTable("Development_Group");

                entity.Property(e => e.Name).HasMaxLength(100);
            });

            modelBuilder.Entity<FeesForGrade>(entity =>
            {
                entity.HasKey(e => e.Grade)
                    .HasName("PRIMARY");

                entity.ToTable("Fees_For_Grade");

                entity.Property(e => e.Grade).ValueGeneratedNever();

                entity.Property(e => e.Amount).HasPrecision(19, 2);
            });

            modelBuilder.Entity<FileToDelete>(entity =>
            {
                entity.HasKey(e => e.FilePath)
                    .HasName("PRIMARY");

                entity.ToTable("File_To_Delete");

                entity.Property(e => e.FilePath)
                    .HasMaxLength(700)
                    .HasColumnName("File_Path");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.FileName)
                    .HasMaxLength(500)
                    .HasColumnName("File_Name");
            });

            modelBuilder.Entity<GeneratedReportFile>(entity =>
            {
                entity.ToTable("Generated_Report_File");

                entity.HasIndex(e => e.JobId, "Job_Id");

                entity.HasIndex(e => e.ReportId, "Report_Id");

                entity.Property(e => e.FailureMessage)
                    .HasMaxLength(2000)
                    .HasColumnName("Failure_Message");

                entity.Property(e => e.FilePath)
                    .HasMaxLength(500)
                    .HasColumnName("File_Path");

                entity.Property(e => e.JobId).HasColumnName("Job_Id");

                entity.Property(e => e.ReportId).HasColumnName("Report_Id");

                entity.HasOne(d => d.Job)
                    .WithMany(p => p.GeneratedReportFiles)
                    .HasForeignKey(d => d.JobId)
                    .HasConstraintName("Generated_Report_File_ibfk_1");

                entity.HasOne(d => d.Report)
                    .WithMany(p => p.GeneratedReportFiles)
                    .HasForeignKey(d => d.ReportId)
                    .HasConstraintName("Generated_Report_File_ibfk_2");
            });

            modelBuilder.Entity<MedicalCondition>(entity =>
            {
                entity.ToTable("Medical_Condition");

                entity.Property(e => e.Name).HasMaxLength(100);
            });

            modelBuilder.Entity<NonScaSibling>(entity =>
            {
                entity.ToTable("Non_Sca_Siblings");

                entity.HasIndex(e => e.StudentNumber, "Student_Number");

                entity.Property(e => e.Name).HasMaxLength(150);

                entity.Property(e => e.StudentNumber)
                    .HasMaxLength(150)
                    .HasColumnName("Student_Number");

                entity.HasOne(d => d.StudentNumberNavigation)
                    .WithMany(p => p.NonScaSiblings)
                    .HasForeignKey(d => d.StudentNumber)
                    .HasConstraintName("Non_Sca_Siblings_ibfk_1");
            });

            modelBuilder.Entity<OtherParent>(entity =>
            {
                entity.ToTable("Other_Parent");

                entity.HasIndex(e => e.MainParentId, "Main_Parent_Id");

                entity.Property(e => e.CellNumber)
                    .HasMaxLength(20)
                    .HasColumnName("Cell_Number");

                entity.Property(e => e.Employer).HasMaxLength(200);

                entity.Property(e => e.Fax).HasMaxLength(50);

                entity.Property(e => e.FirstName)
                    .HasMaxLength(100)
                    .HasColumnName("First_Name");

                entity.Property(e => e.IdNumber)
                    .HasMaxLength(100)
                    .HasColumnName("Id_Number");

                entity.Property(e => e.LastName)
                    .HasMaxLength(100)
                    .HasColumnName("Last_Name");

                entity.Property(e => e.MainParentId).HasColumnName("Main_Parent_Id");

                entity.Property(e => e.MaritalStatus)
                    .HasMaxLength(50)
                    .HasColumnName("Marital_Status");

                entity.Property(e => e.MonthlyIncome)
                    .HasPrecision(19, 2)
                    .HasColumnName("Monthly_Income");

                entity.Property(e => e.Occupation).HasMaxLength(200);

                entity.Property(e => e.PostalAddress)
                    .HasMaxLength(200)
                    .HasColumnName("Postal_Address");

                entity.Property(e => e.ResidentialAddress)
                    .HasMaxLength(1000)
                    .HasColumnName("Residential_Address");

                entity.Property(e => e.SpecialistSkillsHobbies)
                    .HasMaxLength(3000)
                    .HasColumnName("Specialist_Skills_Hobbies");

                entity.Property(e => e.TelephoneHome)
                    .HasMaxLength(50)
                    .HasColumnName("Telephone_Home");

                entity.Property(e => e.TelephoneWork)
                    .HasMaxLength(50)
                    .HasColumnName("Telephone_Work");

                entity.Property(e => e.WorkingHours)
                    .HasMaxLength(100)
                    .HasColumnName("Working_Hours");

                entity.HasOne(d => d.MainParent)
                    .WithMany(p => p.OtherParents)
                    .HasForeignKey(d => d.MainParentId)
                    .HasConstraintName("Other_Parent_ibfk_1");
            });

            modelBuilder.Entity<Parent>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PRIMARY");

                entity.ToTable("Parent");

                entity.Property(e => e.UserId)
                    .ValueGeneratedNever()
                    .HasColumnName("User_Id");

                entity.Property(e => e.CellNumber)
                    .HasMaxLength(20)
                    .HasColumnName("Cell_Number");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.Employer).HasMaxLength(200);

                entity.Property(e => e.Fax).HasMaxLength(50);

                entity.Property(e => e.IdNumber)
                    .HasMaxLength(100)
                    .HasColumnName("Id_Number");

                entity.Property(e => e.MaritalStatus)
                    .HasMaxLength(50)
                    .HasColumnName("Marital_Status");

                entity.Property(e => e.MonthlyIncome)
                    .HasPrecision(19, 2)
                    .HasColumnName("Monthly_Income");

                entity.Property(e => e.Occupation).HasMaxLength(200);

                entity.Property(e => e.PostalAddress)
                    .HasMaxLength(200)
                    .HasColumnName("Postal_Address");

                entity.Property(e => e.ReasonForSchoolSelection)
                    .HasMaxLength(1000)
                    .HasColumnName("Reason_For_School_Selection");

                entity.Property(e => e.RegistrationStage).HasColumnName("Registration_Stage");

                entity.Property(e => e.ResidentialAddress)
                    .HasMaxLength(1000)
                    .HasColumnName("Residential_Address");

                entity.Property(e => e.SchoolDiscovery)
                    .HasMaxLength(400)
                    .HasColumnName("School_Discovery");

                entity.Property(e => e.SpecialistSkillsHobbies)
                    .HasMaxLength(3000)
                    .HasColumnName("Specialist_Skills_Hobbies");

                entity.Property(e => e.TelephoneHome)
                    .HasMaxLength(50)
                    .HasColumnName("Telephone_Home");

                entity.Property(e => e.TelephoneWork)
                    .HasMaxLength(50)
                    .HasColumnName("Telephone_Work");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.Property(e => e.WorkingHours)
                    .HasMaxLength(100)
                    .HasColumnName("Working_Hours");

                entity.HasOne(d => d.User)
                    .WithOne(p => p.Parent)
                    .HasForeignKey<Parent>(d => d.UserId)
                    .HasConstraintName("Parent_ibfk_1");
            });

            modelBuilder.Entity<ParentFinancialStatement>(entity =>
            {
                entity.HasKey(e => e.ParentId)
                    .HasName("PRIMARY");

                entity.ToTable("Parent_Financial_Statement");

                entity.Property(e => e.ParentId)
                    .ValueGeneratedNever()
                    .HasColumnName("Parent_Id");

                entity.Property(e => e.CurrentBalance)
                    .HasPrecision(19, 2)
                    .HasColumnName("Current_Balance");

                entity.HasOne(d => d.Parent)
                    .WithOne(p => p.ParentFinancialStatement)
                    .HasForeignKey<ParentFinancialStatement>(d => d.ParentId)
                    .HasConstraintName("Parent_Financial_Statement_ibfk_1");
            });

            modelBuilder.Entity<ParentRegistrationFile>(entity =>
            {
                entity.HasKey(e => e.FilePath)
                    .HasName("PRIMARY");

                entity.ToTable("Parent_Registration_File");

                entity.HasIndex(e => e.RequiredId, "Required_Id");

                entity.HasIndex(e => e.UserId, "User_Id");

                entity.Property(e => e.FilePath)
                    .HasMaxLength(500)
                    .HasColumnName("File_Path");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.Name).HasMaxLength(200);

                entity.Property(e => e.RequiredId).HasColumnName("Required_Id");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.HasOne(d => d.Required)
                    .WithMany(p => p.ParentRegistrationFiles)
                    .HasForeignKey(d => d.RequiredId)
                    .HasConstraintName("Parent_Registration_File_ibfk_2");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.ParentRegistrationFiles)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("Parent_Registration_File_ibfk_1");
            });

            modelBuilder.Entity<ParentRegistrationPaymentFile>(entity =>
            {
                entity.HasKey(e => e.FilePath)
                    .HasName("PRIMARY");

                entity.ToTable("Parent_Registration_Payment_File");

                entity.HasIndex(e => e.ParentId, "Parent_Id");

                entity.Property(e => e.FilePath)
                    .HasMaxLength(600)
                    .HasColumnName("File_Path");

                entity.Property(e => e.FileName)
                    .HasMaxLength(500)
                    .HasColumnName("File_Name");

                entity.Property(e => e.ParentId).HasColumnName("Parent_Id");

                entity.HasOne(d => d.Parent)
                    .WithMany(p => p.ParentRegistrationPaymentFiles)
                    .HasForeignKey(d => d.ParentId)
                    .HasConstraintName("Parent_Registration_Payment_File_ibfk_1");
            });

            modelBuilder.Entity<ParentRegistrationStatus>(entity =>
            {
                entity.HasKey(e => e.ParentId)
                    .HasName("PRIMARY");

                entity.ToTable("Parent_Registration_Status");

                entity.Property(e => e.ParentId)
                    .ValueGeneratedNever()
                    .HasColumnName("Parent_Id");

                entity.Property(e => e.DetailsAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Details_Added");

                entity.Property(e => e.DetailsRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Details_Rejection_Message");

                entity.Property(e => e.OtherParentsAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Other_Parents_Added");

                entity.Property(e => e.OtherParentsRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Other_Parents_Rejection_Message");

                entity.Property(e => e.RegistrationFeePaid)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Registration_Fee_Paid");

                entity.Property(e => e.RegistrationFeeRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Registration_Fee_Rejection_Message");

                entity.Property(e => e.RequiredDocsAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Required_Docs_Added");

                entity.Property(e => e.RequiredDocsRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Required_Docs_Rejection_Message");

                entity.Property(e => e.StudentsAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Students_Added");

                entity.Property(e => e.StudentsRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Students_Rejection_Message");

                entity.HasOne(d => d.Parent)
                    .WithOne(p => p.ParentRegistrationStatus)
                    .HasForeignKey<ParentRegistrationStatus>(d => d.ParentId)
                    .HasConstraintName("Parent_Registration_Status_ibfk_1");
            });

            modelBuilder.Entity<Persona>(entity =>
            {
                entity.ToTable("Persona");

                entity.HasIndex(e => e.PersonaCategoryId, "Persona_Category_Id");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.PersonaCategoryId).HasColumnName("Persona_Category_Id");

                entity.HasOne(d => d.PersonaCategory)
                    .WithMany(p => p.Personas)
                    .HasForeignKey(d => d.PersonaCategoryId)
                    .HasConstraintName("Persona_ibfk_1");
            });

            modelBuilder.Entity<PersonaCategory>(entity =>
            {
                entity.ToTable("Persona_Category");

                entity.Property(e => e.Name).HasMaxLength(100);
            });

            modelBuilder.Entity<PersonaGrade>(entity =>
            {
                entity.ToTable("Persona_Grade");

                entity.HasIndex(e => e.PersonaId, "Persona_Id");

                entity.HasIndex(e => e.ReportId, "Report_Id");

                entity.Property(e => e.Grade).HasMaxLength(10);

                entity.Property(e => e.PersonaId).HasColumnName("Persona_Id");

                entity.Property(e => e.ReportId).HasColumnName("Report_Id");

                entity.HasOne(d => d.Persona)
                    .WithMany(p => p.PersonaGrades)
                    .HasForeignKey(d => d.PersonaId)
                    .HasConstraintName("Persona_Grade_ibfk_2");

                entity.HasOne(d => d.Report)
                    .WithMany(p => p.PersonaGrades)
                    .HasForeignKey(d => d.ReportId)
                    .HasConstraintName("Persona_Grade_ibfk_1");
            });

            modelBuilder.Entity<PrePrimaryProgressReport>(entity =>
            {
                entity.ToTable("Pre_Primary_Progress_Report");

                entity.HasIndex(e => e.Year, "Year")
                    .IsUnique();
            });

            modelBuilder.Entity<PrePrimaryReportDetail>(entity =>
            {
                entity.ToTable("Pre_Primary_Report_Details");

                entity.HasIndex(e => e.ReportId, "Report_Id");

                entity.Property(e => e.DaysAbsent).HasColumnName("Days_Absent");

                entity.Property(e => e.DominantHand).HasColumnName("Dominant_Hand");

                entity.Property(e => e.RegisterTeacher)
                    .HasMaxLength(200)
                    .HasColumnName("Register_Teacher");

                entity.Property(e => e.Remarks).HasMaxLength(2000);

                entity.Property(e => e.ReportId).HasColumnName("Report_Id");

                entity.HasOne(d => d.Report)
                    .WithMany(p => p.PrePrimaryReportDetails)
                    .HasForeignKey(d => d.ReportId)
                    .HasConstraintName("Pre_Primary_Report_Details_ibfk_1");
            });

            modelBuilder.Entity<PrimaryReportDetail>(entity =>
            {
                entity.ToTable("Primary_Report_Details");

                entity.HasIndex(e => e.ReportId, "Report_Id");

                entity.Property(e => e.DaysAbsent).HasColumnName("Days_Absent");

                entity.Property(e => e.PersonaBriefComments)
                    .HasMaxLength(2000)
                    .HasColumnName("Persona_Brief_Comments");

                entity.Property(e => e.RegisterTeacher)
                    .HasMaxLength(200)
                    .HasColumnName("Register_Teacher");

                entity.Property(e => e.ReportId).HasColumnName("Report_Id");

                entity.HasOne(d => d.Report)
                    .WithMany(p => p.PrimaryReportDetails)
                    .HasForeignKey(d => d.ReportId)
                    .HasConstraintName("Primary_Report_Details_ibfk_1");
            });

            modelBuilder.Entity<ProgressReportAssessment>(entity =>
            {
                entity.ToTable("Progress_Report_Assessment");

                entity.HasIndex(e => e.ProgressReportCategoryId, "Progress_Report_Category_Id");

                entity.Property(e => e.MarksAvailable)
                    .HasPrecision(19, 2)
                    .HasColumnName("Marks_Available");

                entity.Property(e => e.Name).HasMaxLength(200);

                entity.Property(e => e.ProgressReportCategoryId).HasColumnName("Progress_Report_Category_Id");

                entity.HasOne(d => d.ProgressReportCategory)
                    .WithMany(p => p.ProgressReportAssessments)
                    .HasForeignKey(d => d.ProgressReportCategoryId)
                    .HasConstraintName("Progress_Report_Assessment_ibfk_1");
            });

            modelBuilder.Entity<ProgressReportCategory>(entity =>
            {
                entity.ToTable("Progress_Report_Category");

                entity.HasIndex(e => e.ProgressReportId, "Progress_Report_Id");

                entity.Property(e => e.Name).HasMaxLength(200);

                entity.Property(e => e.ProgressReportId).HasColumnName("Progress_Report_Id");

                entity.Property(e => e.Weight).HasPrecision(19, 2);

                entity.HasOne(d => d.ProgressReport)
                    .WithMany(p => p.ProgressReportCategories)
                    .HasForeignKey(d => d.ProgressReportId)
                    .HasConstraintName("Progress_Report_Category_ibfk_1");
            });

            modelBuilder.Entity<ProgressReportTemplate>(entity =>
            {
                entity.ToTable("Progress_Report_Template");

                entity.Property(e => e.ExamMarksAvailable)
                    .HasPrecision(19, 2)
                    .HasColumnName("Exam_Marks_Available");

                entity.Property(e => e.ExamWeight)
                    .HasPrecision(19, 2)
                    .HasColumnName("Exam_Weight");

                entity.Property(e => e.Name).HasMaxLength(200);
            });

            modelBuilder.Entity<ProofOfDeposit>(entity =>
            {
                entity.ToTable("Proof_Of_Deposit");

                entity.HasIndex(e => e.ParentId, "Parent_Id");

                entity.Property(e => e.Amount).HasPrecision(19, 2);

                entity.Property(e => e.FileName)
                    .HasMaxLength(500)
                    .HasColumnName("File_Name");

                entity.Property(e => e.FilePath)
                    .HasMaxLength(500)
                    .HasColumnName("File_Path");

                entity.Property(e => e.ParentId).HasColumnName("Parent_Id");

                entity.Property(e => e.RejectionMessage)
                    .HasMaxLength(3000)
                    .HasColumnName("Rejection_Message");

                entity.HasOne(d => d.Parent)
                    .WithMany(p => p.ProofOfDeposits)
                    .HasForeignKey(d => d.ParentId)
                    .HasConstraintName("Proof_Of_Deposit_ibfk_1");
            });

            modelBuilder.Entity<Report>(entity =>
            {
                entity.ToTable("Report");

                entity.HasIndex(e => e.ReportGroupId, "Report_Group_Id");

                entity.HasIndex(e => e.ReportTypeId, "Report_Type_Id");

                entity.HasIndex(e => new { e.StudentNumber, e.ReportGroupId }, "Student_Number")
                    .IsUnique();

                entity.Property(e => e.ReportGroupId).HasColumnName("Report_Group_Id");

                entity.Property(e => e.ReportTypeId).HasColumnName("Report_Type_Id");

                entity.Property(e => e.StudentNumber)
                    .HasMaxLength(150)
                    .HasColumnName("Student_Number");

                entity.HasOne(d => d.ReportGroup)
                    .WithMany(p => p.Reports)
                    .HasForeignKey(d => d.ReportGroupId)
                    .HasConstraintName("Report_ibfk_2");

                entity.HasOne(d => d.ReportType)
                    .WithMany(p => p.Reports)
                    .HasForeignKey(d => d.ReportTypeId)
                    .HasConstraintName("Report_ibfk_1");

                entity.HasOne(d => d.StudentNumberNavigation)
                    .WithMany(p => p.Reports)
                    .HasForeignKey(d => d.StudentNumber)
                    .HasConstraintName("Report_ibfk_3");
            });

            modelBuilder.Entity<ReportGenerationJob>(entity =>
            {
                entity.ToTable("Report_Generation_Job");

                entity.HasIndex(e => e.ReportGroupId, "Report_Group_Id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.ReportGroupId).HasColumnName("Report_Group_Id");

                entity.Property(e => e.SchoolReOpens).HasColumnName("School_Re_Opens");

                entity.Property(e => e.Status).HasDefaultValueSql("'0'");

                entity.HasOne(d => d.ReportGroup)
                    .WithMany(p => p.ReportGenerationJobs)
                    .HasForeignKey(d => d.ReportGroupId)
                    .HasConstraintName("Report_Generation_Job_ibfk_1");
            });

            modelBuilder.Entity<ReportGroup>(entity =>
            {
                entity.ToTable("Report_Group");

                entity.HasIndex(e => e.Year, "Year")
                    .IsUnique();

                entity.Property(e => e.Year).HasColumnType("year");
            });

            modelBuilder.Entity<ReportType>(entity =>
            {
                entity.ToTable("Report_Type");

                entity.Property(e => e.Name).HasMaxLength(100);
            });

            modelBuilder.Entity<RequiredRegistrationDocument>(entity =>
            {
                entity.ToTable("Required_Registration_Document");

                entity.HasIndex(e => e.UserTypeId, "User_Type_Id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.Description).HasMaxLength(100);

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.Property(e => e.UserTypeId).HasColumnName("User_Type_Id");

                entity.HasOne(d => d.UserType)
                    .WithMany(p => p.RequiredRegistrationDocuments)
                    .HasForeignKey(d => d.UserTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Required_Registration_Document_ibfk_1");
            });

            modelBuilder.Entity<StatementItem>(entity =>
            {
                entity.ToTable("Statement_Item");

                entity.HasIndex(e => e.StatementId, "Statement_Id");

                entity.Property(e => e.CreditAmount)
                    .HasPrecision(19, 2)
                    .HasColumnName("Credit_Amount");

                entity.Property(e => e.DebitAmount)
                    .HasPrecision(19, 2)
                    .HasColumnName("Debit_Amount");

                entity.Property(e => e.Description).HasMaxLength(700);

                entity.Property(e => e.Reference).HasMaxLength(100);

                entity.Property(e => e.StatementId).HasColumnName("Statement_Id");

                entity.HasOne(d => d.Statement)
                    .WithMany(p => p.StatementItems)
                    .HasForeignKey(d => d.StatementId)
                    .HasConstraintName("Statement_Item_ibfk_1");
            });

            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(e => e.StudentNumber)
                    .HasName("PRIMARY");

                entity.ToTable("Student");

                entity.HasIndex(e => e.ParentId, "Parent_Id");

                entity.Property(e => e.StudentNumber)
                    .HasMaxLength(150)
                    .HasColumnName("Student_Number");

                entity.Property(e => e.AcademicFailureAssessment)
                    .HasColumnType("text")
                    .HasColumnName("Academic_Failure_Assessment");

                entity.Property(e => e.AcademicLevel)
                    .HasMaxLength(100)
                    .HasColumnName("Academic_Level");

                entity.Property(e => e.ApprovalRequested)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Approval_Requested");

                entity.Property(e => e.BaptismDate).HasColumnName("Baptism_Date");

                entity.Property(e => e.Bedtime).HasMaxLength(100);

                entity.Property(e => e.BitesFingerNails)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Bites_Finger_Nails");

                entity.Property(e => e.ChronicMedication)
                    .HasColumnType("text")
                    .HasColumnName("Chronic_Medication");

                entity.Property(e => e.Citizenship).HasMaxLength(100);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CurrentChurch)
                    .HasMaxLength(200)
                    .HasColumnName("Current_Church");

                entity.Property(e => e.CurrentChurchAddress)
                    .HasMaxLength(200)
                    .HasColumnName("Current_Church_Address");

                entity.Property(e => e.CurrentGrade).HasColumnName("Current_Grade");

                entity.Property(e => e.DisabilityDueToDiseaseOrAccident)
                    .HasColumnType("text")
                    .HasColumnName("Disability_Due_To_Disease_Or_Accident");

                entity.Property(e => e.DisiplinaryDifficulties)
                    .HasColumnType("text")
                    .HasColumnName("Disiplinary_Difficulties");

                entity.Property(e => e.DoctorTelephone)
                    .HasMaxLength(20)
                    .HasColumnName("Doctor_Telephone");

                entity.Property(e => e.EatsBreakfastRegularly)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Eats_Breakfast_Regularly");

                entity.Property(e => e.FamilyDoctor)
                    .HasMaxLength(200)
                    .HasColumnName("Family_Doctor");

                entity.Property(e => e.FatherConfirmationDate).HasColumnName("Father_Confirmation_Date");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(200)
                    .HasColumnName("First_Name");

                entity.Property(e => e.GeneralHearingTestDate).HasColumnName("General_Hearing_Test_Date");

                entity.Property(e => e.GeneralVisionTestDate).HasColumnName("General_Vision_Test_Date");

                entity.Property(e => e.HasExcessiveFears)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Has_Excessive_Fears");

                entity.Property(e => e.HomeLanguage)
                    .HasMaxLength(100)
                    .HasColumnName("Home_Language");

                entity.Property(e => e.IsShy)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Is_Shy");

                entity.Property(e => e.LastName)
                    .HasMaxLength(100)
                    .HasColumnName("Last_Name");

                entity.Property(e => e.LastSchoolAttended)
                    .HasMaxLength(150)
                    .HasColumnName("Last_School_Attended");

                entity.Property(e => e.LearningDifficulties)
                    .HasColumnType("text")
                    .HasColumnName("Learning_Difficulties");

                entity.Property(e => e.LegalDifficulties)
                    .HasColumnType("text")
                    .HasColumnName("Legal_Difficulties");

                entity.Property(e => e.LikesSchool)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Likes_School");

                entity.Property(e => e.MotherConfirmationDate).HasColumnName("Mother_Confirmation_Date");

                entity.Property(e => e.NameOfPrincipal)
                    .HasMaxLength(100)
                    .HasColumnName("Name_Of_Principal");

                entity.Property(e => e.OtherMedicalConditions)
                    .HasColumnType("text")
                    .HasColumnName("Other_Medical_Conditions");

                entity.Property(e => e.ParentId).HasColumnName("Parent_Id");

                entity.Property(e => e.Pastor).HasMaxLength(200);

                entity.Property(e => e.PastorTelephone)
                    .HasMaxLength(20)
                    .HasColumnName("Pastor_Telephone");

                entity.Property(e => e.PlaysWellWithOthers)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Plays_Well_With_Others");

                entity.Property(e => e.PostalAddress)
                    .HasMaxLength(200)
                    .HasColumnName("Postal_Address");

                entity.Property(e => e.RegistrationStage).HasColumnName("Registration_Stage");

                entity.Property(e => e.RejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Rejection_Message");

                entity.Property(e => e.ResidentialAddress)
                    .HasMaxLength(500)
                    .HasColumnName("Residential_Address");

                entity.Property(e => e.RisingTime)
                    .HasMaxLength(100)
                    .HasColumnName("Rising_Time");

                entity.Property(e => e.SchoolAddress)
                    .HasMaxLength(400)
                    .HasColumnName("School_Address");

                entity.Property(e => e.StudentsStrengths)
                    .HasColumnType("text")
                    .HasColumnName("Students_Strengths");

                entity.Property(e => e.StudyPermit)
                    .HasMaxLength(500)
                    .HasColumnName("Study_Permit");

                entity.Property(e => e.SucksThumb)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Sucks_Thumb");

                entity.Property(e => e.TalentsAndInterests)
                    .HasColumnType("text")
                    .HasColumnName("Talents_And_Interests");

                entity.Property(e => e.TelephoneHome)
                    .HasMaxLength(100)
                    .HasColumnName("Telephone_Home");

                entity.Property(e => e.TelephoneOther)
                    .HasMaxLength(100)
                    .HasColumnName("Telephone_Other");

                entity.Property(e => e.TuberculosisTestDate).HasColumnName("Tuberculosis_Test_Date");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.Parent)
                    .WithMany(p => p.Students)
                    .HasForeignKey(d => d.ParentId)
                    .HasConstraintName("Student_ibfk_1");
            });

            modelBuilder.Entity<StudentMedicalCondition>(entity =>
            {
                entity.HasKey(e => new { e.StudentNumber, e.MedicalId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("Student_Medical_Condition");

                entity.HasIndex(e => e.MedicalId, "Medical_Id");

                entity.Property(e => e.StudentNumber)
                    .HasMaxLength(150)
                    .HasColumnName("Student_Number");

                entity.Property(e => e.MedicalId).HasColumnName("Medical_Id");

                entity.HasOne(d => d.Medical)
                    .WithMany(p => p.StudentMedicalConditions)
                    .HasForeignKey(d => d.MedicalId)
                    .HasConstraintName("Student_Medical_Condition_ibfk_2");

                entity.HasOne(d => d.StudentNumberNavigation)
                    .WithMany(p => p.StudentMedicalConditions)
                    .HasForeignKey(d => d.StudentNumber)
                    .HasConstraintName("Student_Medical_Condition_ibfk_1");
            });

            modelBuilder.Entity<StudentOccupationalTherapyFile>(entity =>
            {
                entity.HasKey(e => e.FilePath)
                    .HasName("PRIMARY");

                entity.ToTable("Student_Occupational_Therapy_File");

                entity.HasIndex(e => e.StudentNumber, "Student_Number");

                entity.Property(e => e.FilePath)
                    .HasMaxLength(600)
                    .HasColumnName("File_Path");

                entity.Property(e => e.FileName)
                    .HasMaxLength(500)
                    .HasColumnName("File_Name");

                entity.Property(e => e.StudentNumber)
                    .HasMaxLength(150)
                    .HasColumnName("Student_Number");

                entity.HasOne(d => d.StudentNumberNavigation)
                    .WithMany(p => p.StudentOccupationalTherapyFiles)
                    .HasForeignKey(d => d.StudentNumber)
                    .HasConstraintName("Student_Occupational_Therapy_File_ibfk_1");
            });

            modelBuilder.Entity<StudentOtherParent>(entity =>
            {
                entity.HasKey(e => new { e.StudentNumber, e.ParentId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("Student_Other_Parent");

                entity.HasIndex(e => e.ParentId, "Parent_Id");

                entity.Property(e => e.StudentNumber)
                    .HasMaxLength(150)
                    .HasColumnName("Student_Number");

                entity.Property(e => e.ParentId).HasColumnName("Parent_Id");

                entity.HasOne(d => d.Parent)
                    .WithMany(p => p.StudentOtherParents)
                    .HasForeignKey(d => d.ParentId)
                    .HasConstraintName("Student_Other_Parent_ibfk_2");

                entity.HasOne(d => d.StudentNumberNavigation)
                    .WithMany(p => p.StudentOtherParents)
                    .HasForeignKey(d => d.StudentNumber)
                    .HasConstraintName("Student_Other_Parent_ibfk_1");
            });

            modelBuilder.Entity<StudentPrePrimaryProgressReport>(entity =>
            {
                entity.ToTable("Student_Pre_Primary_Progress_Report");

                entity.HasIndex(e => e.ProgressReportId, "ProgressReportId");

                entity.HasIndex(e => e.StudentNumber, "Student_Number");

                entity.Property(e => e.StudentNumber)
                    .HasMaxLength(150)
                    .HasColumnName("Student_Number");

                entity.HasOne(d => d.ProgressReport)
                    .WithMany(p => p.StudentPrePrimaryProgressReports)
                    .HasForeignKey(d => d.ProgressReportId)
                    .HasConstraintName("Student_Pre_Primary_Progress_Report_ibfk_1");

                entity.HasOne(d => d.StudentNumberNavigation)
                    .WithMany(p => p.StudentPrePrimaryProgressReports)
                    .HasForeignKey(d => d.StudentNumber)
                    .HasConstraintName("Student_Pre_Primary_Progress_Report_ibfk_2");
            });

            modelBuilder.Entity<StudentProgressReport>(entity =>
            {
                entity.ToTable("Student_Progress_Report");

                entity.HasIndex(e => e.CourseProgressReportId, "Course_Progress_Report_Id");

                entity.HasIndex(e => new { e.StudentNumber, e.CourseProgressReportId }, "Student_Number")
                    .IsUnique();

                entity.Property(e => e.CourseProgressReportId).HasColumnName("Course_Progress_Report_Id");

                entity.Property(e => e.ExamMark)
                    .HasPrecision(19, 2)
                    .HasColumnName("Exam_Mark");

                entity.Property(e => e.StudentNumber)
                    .HasMaxLength(150)
                    .HasColumnName("Student_Number");

                entity.HasOne(d => d.CourseProgressReport)
                    .WithMany(p => p.StudentProgressReports)
                    .HasForeignKey(d => d.CourseProgressReportId)
                    .HasConstraintName("Student_Progress_Report_ibfk_1");

                entity.HasOne(d => d.StudentNumberNavigation)
                    .WithMany(p => p.StudentProgressReports)
                    .HasForeignKey(d => d.StudentNumber)
                    .HasConstraintName("Student_Progress_Report_ibfk_2");
            });

            modelBuilder.Entity<StudentProgressReportAssessment>(entity =>
            {
                entity.ToTable("Student_Progress_Report_Assessment");

                entity.HasIndex(e => e.ProgressReportAssessmentId, "Progress_Report_Assessment_Id");

                entity.HasIndex(e => new { e.StudentProgressReportId, e.ProgressReportAssessmentId, e.Term }, "Student_Progress_Report_Id")
                    .IsUnique();

                entity.Property(e => e.Mark).HasPrecision(19, 2);

                entity.Property(e => e.ProgressReportAssessmentId).HasColumnName("Progress_Report_Assessment_Id");

                entity.Property(e => e.StudentProgressReportId).HasColumnName("Student_Progress_Report_Id");

                entity.HasOne(d => d.ProgressReportAssessment)
                    .WithMany(p => p.StudentProgressReportAssessments)
                    .HasForeignKey(d => d.ProgressReportAssessmentId)
                    .HasConstraintName("Student_Progress_Report_Assessment_ibfk_2");

                entity.HasOne(d => d.StudentProgressReport)
                    .WithMany(p => p.StudentProgressReportAssessments)
                    .HasForeignKey(d => d.StudentProgressReportId)
                    .HasConstraintName("Student_Progress_Report_Assessment_ibfk_1");
            });

            modelBuilder.Entity<StudentProgressReportExamMark>(entity =>
            {
                entity.ToTable("Student_Progress_Report_Exam_Mark");

                entity.HasIndex(e => new { e.StudentProgressReportId, e.Term }, "Student_Progress_Report_Id")
                    .IsUnique();

                entity.Property(e => e.Mark).HasPrecision(19, 2);

                entity.Property(e => e.StudentProgressReportId).HasColumnName("Student_Progress_Report_Id");

                entity.HasOne(d => d.StudentProgressReport)
                    .WithMany(p => p.StudentProgressReportExamMarks)
                    .HasForeignKey(d => d.StudentProgressReportId)
                    .HasConstraintName("Student_Progress_Report_Exam_Mark_ibfk_1");
            });

            modelBuilder.Entity<StudentRegistrationFile>(entity =>
            {
                entity.HasKey(e => e.FilePath)
                    .HasName("PRIMARY");

                entity.ToTable("Student_Registration_File");

                entity.HasIndex(e => e.RequiredId, "Required_Id");

                entity.HasIndex(e => e.StudentNumber, "Student_Number");

                entity.Property(e => e.FilePath)
                    .HasMaxLength(500)
                    .HasColumnName("File_Path");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.Name).HasMaxLength(200);

                entity.Property(e => e.RequiredId).HasColumnName("Required_Id");

                entity.Property(e => e.StudentNumber)
                    .HasMaxLength(150)
                    .HasColumnName("Student_Number");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.HasOne(d => d.Required)
                    .WithMany(p => p.StudentRegistrationFiles)
                    .HasForeignKey(d => d.RequiredId)
                    .HasConstraintName("Student_Registration_File_ibfk_2");

                entity.HasOne(d => d.StudentNumberNavigation)
                    .WithMany(p => p.StudentRegistrationFiles)
                    .HasForeignKey(d => d.StudentNumber)
                    .HasConstraintName("Student_Registration_File_ibfk_1");
            });

            modelBuilder.Entity<StudentRegistrationStatus>(entity =>
            {
                entity.HasKey(e => e.StudentNumber)
                    .HasName("PRIMARY");

                entity.ToTable("Student_Registration_Status");

                entity.Property(e => e.StudentNumber)
                    .HasMaxLength(150)
                    .HasColumnName("Student_Number");

                entity.Property(e => e.BasicDetailsAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Basic_Details_Added");

                entity.Property(e => e.BasicRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Basic_Rejection_Message");

                entity.Property(e => e.ConditionsRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Conditions_Rejection_Message");

                entity.Property(e => e.DiagnosticRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Diagnostic_Rejection_Message");

                entity.Property(e => e.DiagnosticResultAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Diagnostic_Result_Added");

                entity.Property(e => e.DiagnosticTestLink)
                    .HasMaxLength(200)
                    .HasColumnName("Diagnostic_Test_Link");

                entity.Property(e => e.DiagnosticTestNeeded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Diagnostic_Test_Needed");

                entity.Property(e => e.GeneralInfoAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("General_Info_Added");

                entity.Property(e => e.GeneralRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("General_Rejection_Message");

                entity.Property(e => e.MedicalConditionsAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Medical_Conditions_Added");

                entity.Property(e => e.MedicalInfoAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Medical_Info_Added");

                entity.Property(e => e.MedicalRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Medical_Rejection_Message");

                entity.Property(e => e.NonScaRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Non_Sca_Rejection_Message");

                entity.Property(e => e.NonScaStudentsAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Non_Sca_Students_Added");

                entity.Property(e => e.OccupationalReportAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Occupational_Report_Added");

                entity.Property(e => e.OccupationalTherapyNeeded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Occupational_Therapy_Needed");

                entity.Property(e => e.OtherParentsAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Other_Parents_Added");

                entity.Property(e => e.OtherParentsRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Other_Parents_Rejection_Message");

                entity.Property(e => e.ReligiousInfoAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Religious_Info_Added");

                entity.Property(e => e.ReligiousRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Religious_Rejection_Message");

                entity.Property(e => e.RequiredDocsAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Required_Docs_Added");

                entity.Property(e => e.RequiredDocsRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Required_Docs_Rejection_Message");

                entity.Property(e => e.ScholasticInfoAdded)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Scholastic_Info_Added");

                entity.Property(e => e.ScholasticRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Scholastic_Rejection_Message");

                entity.Property(e => e.TherapistCell)
                    .HasMaxLength(20)
                    .HasColumnName("Therapist_Cell");

                entity.Property(e => e.TherapistEmail)
                    .HasMaxLength(100)
                    .HasColumnName("Therapist_Email");

                entity.Property(e => e.TherapistName)
                    .HasMaxLength(100)
                    .HasColumnName("Therapist_Name");

                entity.Property(e => e.TherapistUrl)
                    .HasMaxLength(100)
                    .HasColumnName("Therapist_Url");

                entity.Property(e => e.TherapyRejectionMessage)
                    .HasColumnType("text")
                    .HasColumnName("Therapy_Rejection_Message");

                entity.HasOne(d => d.StudentNumberNavigation)
                    .WithOne(p => p.StudentRegistrationStatus)
                    .HasForeignKey<StudentRegistrationStatus>(d => d.StudentNumber)
                    .HasConstraintName("Student_Registration_Status_ibfk_1");
            });

            modelBuilder.Entity<UserAccount>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PRIMARY");

                entity.ToTable("User_Account");

                entity.HasIndex(e => e.UserTypeId, "User_Type_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.Property(e => e.ConfirmationCode)
                    .HasMaxLength(40)
                    .HasColumnName("Confirmation_Code");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.Email).HasMaxLength(100);

                entity.Property(e => e.FirstName)
                    .HasMaxLength(100)
                    .HasColumnName("First_Name");

                entity.Property(e => e.IsActive).HasColumnType("bit(1)");

                entity.Property(e => e.IsApproved).HasColumnType("bit(1)");

                entity.Property(e => e.IsConfirmed).HasColumnType("bit(1)");

                entity.Property(e => e.LastLogin).HasColumnType("datetime");

                entity.Property(e => e.LastName)
                    .HasMaxLength(100)
                    .HasColumnName("Last_Name");

                entity.Property(e => e.Password)
                    .HasMaxLength(100)
                    .HasColumnName("_Password");

                entity.Property(e => e.ProfilePicPath)
                    .HasMaxLength(500)
                    .HasColumnName("Profile_Pic_Path");

                entity.Property(e => e.RefreshToken)
                    .HasMaxLength(100)
                    .HasColumnName("Refresh_Token");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.Property(e => e.UserTypeId).HasColumnName("User_Type_Id");

                entity.HasOne(d => d.UserType)
                    .WithMany(p => p.UserAccounts)
                    .HasForeignKey(d => d.UserTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("User_Account_ibfk_1");
            });

            modelBuilder.Entity<UserType>(entity =>
            {
                entity.ToTable("User_Type");

                entity.Property(e => e.UserTypeId).HasColumnName("User_Type_Id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.Property(e => e.UserTypeName)
                    .HasMaxLength(100)
                    .HasColumnName("User_Type_Name");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
