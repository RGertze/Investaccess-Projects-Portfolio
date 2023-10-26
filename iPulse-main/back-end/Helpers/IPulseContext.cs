using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace iPulse_back_end.DB_Models
{
    public partial class IPulseContext : DbContext
    {
        public IPulseContext()
        {
        }

        public IPulseContext(DbContextOptions<IPulseContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Appointment> Appointments { get; set; } = null!;
        public virtual DbSet<AppointmentSlot> AppointmentSlots { get; set; } = null!;
        public virtual DbSet<BloodType> BloodTypes { get; set; } = null!;
        public virtual DbSet<DirectMessage> DirectMessages { get; set; } = null!;
        public virtual DbSet<DoctorEducation> DoctorEducations { get; set; } = null!;
        public virtual DbSet<DoctorProfile> DoctorProfiles { get; set; } = null!;
        public virtual DbSet<DoctorReview> DoctorReviews { get; set; } = null!;
        public virtual DbSet<DoctorService> DoctorServices { get; set; } = null!;
        public virtual DbSet<DoctorServiceType> DoctorServiceTypes { get; set; } = null!;
        public virtual DbSet<DoctorSpecialty> DoctorSpecialties { get; set; } = null!;
        public virtual DbSet<DoctorWorkHistory> DoctorWorkHistories { get; set; } = null!;
        public virtual DbSet<Gender> Genders { get; set; } = null!;
        public virtual DbSet<GeneralHealthSummary> GeneralHealthSummaries { get; set; } = null!;
        public virtual DbSet<MedicalAidScheme> MedicalAidSchemes { get; set; } = null!;
        public virtual DbSet<Notification> Notifications { get; set; } = null!;
        public virtual DbSet<NotificationType> NotificationTypes { get; set; } = null!;
        public virtual DbSet<PasswordResetAttempt> PasswordResetAttempts { get; set; } = null!;
        public virtual DbSet<PatientDoctor> PatientDoctors { get; set; } = null!;
        public virtual DbSet<PatientDoctorType> PatientDoctorTypes { get; set; } = null!;
        public virtual DbSet<PatientNextOfKin> PatientNextOfKins { get; set; } = null!;
        public virtual DbSet<PatientProfile> PatientProfiles { get; set; } = null!;
        public virtual DbSet<PatientProfileAccess> PatientProfileAccesses { get; set; } = null!;
        public virtual DbSet<Receptionist> Receptionists { get; set; } = null!;
        public virtual DbSet<UserAccount> UserAccounts { get; set; } = null!;
        public virtual DbSet<UserType> UserTypes { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySql("server=localhost;port=3306;database=IPulse;user=dev;password=Dev@1234;persist security info=False;connect timeout=300", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.30-mysql"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("utf8mb4_0900_ai_ci")
                .HasCharSet("utf8mb4");

            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.ToTable("Appointment");

                entity.HasIndex(e => e.PatientId, "Patient_Id");

                entity.HasIndex(e => e.SlotId, "Slot_Id");

                entity.Property(e => e.AppointmentId).HasColumnName("Appointment_Id");

                entity.Property(e => e.ConfirmationCode)
                    .HasMaxLength(40)
                    .HasColumnName("Confirmation_Code");

                entity.Property(e => e.DateOf).HasColumnName("Date_Of");

                entity.Property(e => e.Description).HasMaxLength(500);

                entity.Property(e => e.PatientId).HasColumnName("Patient_Id");

                entity.Property(e => e.SlotId).HasColumnName("Slot_Id");

                entity.Property(e => e.Title).HasMaxLength(200);

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.Appointments)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("Appointment_ibfk_1");

                entity.HasOne(d => d.Slot)
                    .WithMany(p => p.Appointments)
                    .HasForeignKey(d => d.SlotId)
                    .HasConstraintName("Appointment_ibfk_2");
            });

            modelBuilder.Entity<AppointmentSlot>(entity =>
            {
                entity.HasKey(e => e.SlotId)
                    .HasName("PRIMARY");

                entity.ToTable("Appointment_Slot");

                entity.HasIndex(e => e.DoctorId, "Doctor_Id");

                entity.Property(e => e.SlotId).HasColumnName("Slot_Id");

                entity.Property(e => e.DoctorId).HasColumnName("Doctor_Id");

                entity.Property(e => e.EndTime)
                    .HasColumnType("time")
                    .HasColumnName("End_Time");

                entity.Property(e => e.SlotDay).HasColumnName("Slot_Day");

                entity.Property(e => e.StartTime)
                    .HasColumnType("time")
                    .HasColumnName("Start_Time");

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.AppointmentSlots)
                    .HasForeignKey(d => d.DoctorId)
                    .HasConstraintName("Appointment_Slot_ibfk_1");
            });

            modelBuilder.Entity<BloodType>(entity =>
            {
                entity.ToTable("Blood_Type");

                entity.Property(e => e.BloodTypeId).HasColumnName("Blood_Type_Id");

                entity.Property(e => e.BloodTypeName)
                    .HasMaxLength(100)
                    .HasColumnName("Blood_Type_Name");
            });

            modelBuilder.Entity<DirectMessage>(entity =>
            {
                entity.ToTable("Direct_Message");

                entity.HasIndex(e => e.FromId, "From_Id");

                entity.HasIndex(e => e.ToId, "To_Id");

                entity.Property(e => e.Content).HasMaxLength(1000);

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.DateSent)
                    .HasColumnType("timestamp")
                    .HasColumnName("Date_Sent")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.FromId).HasColumnName("From_Id");

                entity.Property(e => e.Seen)
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'");

                entity.Property(e => e.ToId).HasColumnName("To_Id");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.HasOne(d => d.From)
                    .WithMany(p => p.DirectMessageFroms)
                    .HasForeignKey(d => d.FromId)
                    .HasConstraintName("Direct_Message_ibfk_1");

                entity.HasOne(d => d.To)
                    .WithMany(p => p.DirectMessageTos)
                    .HasForeignKey(d => d.ToId)
                    .HasConstraintName("Direct_Message_ibfk_2");
            });

            modelBuilder.Entity<DoctorEducation>(entity =>
            {
                entity.ToTable("Doctor_Education");

                entity.HasIndex(e => e.DoctorId, "Doctor_Id");

                entity.Property(e => e.DoctorEducationId).HasColumnName("Doctor_Education_Id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.DoctorId).HasColumnName("Doctor_Id");

                entity.Property(e => e.InstituteName)
                    .HasMaxLength(100)
                    .HasColumnName("Institute_Name");

                entity.Property(e => e.QualificationName)
                    .HasMaxLength(100)
                    .HasColumnName("Qualification_Name");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.DoctorEducations)
                    .HasForeignKey(d => d.DoctorId)
                    .HasConstraintName("Doctor_Education_ibfk_1");
            });

            modelBuilder.Entity<DoctorProfile>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PRIMARY");

                entity.ToTable("Doctor_Profile");

                entity.HasIndex(e => e.SpecialtyId, "Specialty_Id");

                entity.Property(e => e.UserId)
                    .ValueGeneratedNever()
                    .HasColumnName("User_Id");

                entity.Property(e => e.AppointmentPrice)
                    .HasPrecision(19, 2)
                    .HasColumnName("Appointment_Price");

                entity.Property(e => e.BusinessHours)
                    .HasMaxLength(100)
                    .HasColumnName("Business_Hours");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.Nationality).HasMaxLength(100);

                entity.Property(e => e.PracticeAddress)
                    .HasMaxLength(100)
                    .HasColumnName("Practice_Address");

                entity.Property(e => e.PracticeCity)
                    .HasMaxLength(100)
                    .HasColumnName("Practice_City");

                entity.Property(e => e.PracticeCountry)
                    .HasMaxLength(100)
                    .HasColumnName("Practice_Country");

                entity.Property(e => e.PracticeName)
                    .HasMaxLength(100)
                    .HasColumnName("Practice_Name");

                entity.Property(e => e.PracticeNumber)
                    .HasMaxLength(100)
                    .HasColumnName("Practice_Number");

                entity.Property(e => e.PracticeWebAddress)
                    .HasMaxLength(200)
                    .HasColumnName("Practice_Web_Address");

                entity.Property(e => e.SecondaryCellphone)
                    .HasMaxLength(16)
                    .HasColumnName("Secondary_Cellphone");

                entity.Property(e => e.SecondaryEmail)
                    .HasMaxLength(100)
                    .HasColumnName("Secondary_Email");

                entity.Property(e => e.SpecialtyId).HasColumnName("Specialty_Id");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.HasOne(d => d.Specialty)
                    .WithMany(p => p.DoctorProfiles)
                    .HasForeignKey(d => d.SpecialtyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Doctor_Profile_ibfk_2");

                entity.HasOne(d => d.User)
                    .WithOne(p => p.DoctorProfile)
                    .HasForeignKey<DoctorProfile>(d => d.UserId)
                    .HasConstraintName("Doctor_Profile_ibfk_1");
            });

            modelBuilder.Entity<DoctorReview>(entity =>
            {
                entity.HasKey(e => e.ReviewId)
                    .HasName("PRIMARY");

                entity.ToTable("Doctor_Review");

                entity.HasIndex(e => e.DoctorId, "Doctor_Id");

                entity.HasIndex(e => e.PatientId, "Patient_Id");

                entity.Property(e => e.ReviewId).HasColumnName("Review_Id");

                entity.Property(e => e.Comment).HasMaxLength(1000);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.DoctorId).HasColumnName("Doctor_Id");

                entity.Property(e => e.PatientId).HasColumnName("Patient_Id");

                entity.Property(e => e.Rating).HasPrecision(5, 2);

                entity.Property(e => e.ReviewDate)
                    .HasColumnType("datetime")
                    .HasColumnName("Review_Date")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.DoctorReviews)
                    .HasForeignKey(d => d.DoctorId)
                    .HasConstraintName("Doctor_Review_ibfk_1");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.DoctorReviews)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("Doctor_Review_ibfk_2");
            });

            modelBuilder.Entity<DoctorService>(entity =>
            {
                entity.HasKey(e => new { e.DoctorId, e.DoctorServiceTypeId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("Doctor_Service");

                entity.HasIndex(e => e.DoctorServiceTypeId, "Doctor_Service_Type_Id");

                entity.Property(e => e.DoctorId).HasColumnName("Doctor_Id");

                entity.Property(e => e.DoctorServiceTypeId).HasColumnName("Doctor_Service_Type_Id");

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

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.DoctorServices)
                    .HasForeignKey(d => d.DoctorId)
                    .HasConstraintName("Doctor_Service_ibfk_1");

                entity.HasOne(d => d.DoctorServiceType)
                    .WithMany(p => p.DoctorServices)
                    .HasForeignKey(d => d.DoctorServiceTypeId)
                    .HasConstraintName("Doctor_Service_ibfk_2");
            });

            modelBuilder.Entity<DoctorServiceType>(entity =>
            {
                entity.ToTable("Doctor_Service_Type");

                entity.Property(e => e.DoctorServiceTypeId).HasColumnName("Doctor_Service_Type_Id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.DoctorServiceTypeName)
                    .HasMaxLength(100)
                    .HasColumnName("Doctor_Service_Type_Name");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");
            });

            modelBuilder.Entity<DoctorSpecialty>(entity =>
            {
                entity.HasKey(e => e.SpecialtyId)
                    .HasName("PRIMARY");

                entity.ToTable("Doctor_Specialty");

                entity.Property(e => e.SpecialtyId).HasColumnName("Specialty_Id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.SpecialtyName)
                    .HasMaxLength(100)
                    .HasColumnName("Specialty_Name");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");
            });

            modelBuilder.Entity<DoctorWorkHistory>(entity =>
            {
                entity.ToTable("Doctor_Work_History");

                entity.HasIndex(e => e.DoctorId, "Doctor_Id");

                entity.Property(e => e.DoctorWorkHistoryId).HasColumnName("Doctor_Work_History_Id");

                entity.Property(e => e.CompanyName)
                    .HasMaxLength(100)
                    .HasColumnName("Company_Name");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.DoctorId).HasColumnName("Doctor_Id");

                entity.Property(e => e.Duties).HasMaxLength(800);

                entity.Property(e => e.EndDate).HasColumnName("End_Date");

                entity.Property(e => e.Role).HasMaxLength(100);

                entity.Property(e => e.StartDate).HasColumnName("Start_Date");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.DoctorWorkHistories)
                    .HasForeignKey(d => d.DoctorId)
                    .HasConstraintName("Doctor_Work_History_ibfk_1");
            });

            modelBuilder.Entity<Gender>(entity =>
            {
                entity.ToTable("Gender");

                entity.Property(e => e.GenderId).HasColumnName("Gender_Id");

                entity.Property(e => e.GenderName)
                    .HasMaxLength(100)
                    .HasColumnName("Gender_Name");
            });

            modelBuilder.Entity<GeneralHealthSummary>(entity =>
            {
                entity.ToTable("General_Health_Summary");

                entity.HasIndex(e => e.DoctorId, "Doctor_Id");

                entity.HasIndex(e => e.PatientId, "Patient_Id");

                entity.Property(e => e.Content).HasColumnType("json");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.DoctorId).HasColumnName("Doctor_Id");

                entity.Property(e => e.PatientId).HasColumnName("Patient_Id");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.GeneralHealthSummaries)
                    .HasForeignKey(d => d.DoctorId)
                    .HasConstraintName("General_Health_Summary_ibfk_1");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.GeneralHealthSummaries)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("General_Health_Summary_ibfk_2");
            });

            modelBuilder.Entity<MedicalAidScheme>(entity =>
            {
                entity.ToTable("Medical_Aid_Scheme");

                entity.Property(e => e.MedicalAidSchemeId).HasColumnName("Medical_Aid_Scheme_Id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.MedicalAidSchemeName)
                    .HasMaxLength(100)
                    .HasColumnName("Medical_Aid_Scheme_Name");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("Notification");

                entity.HasIndex(e => e.TypeId, "Type_Id");

                entity.HasIndex(e => e.UserId, "User_Id");

                entity.Property(e => e.NotificationId).HasColumnName("Notification_Id");

                entity.Property(e => e.Content).HasColumnType("json");

                entity.Property(e => e.DateSent)
                    .HasColumnType("timestamp")
                    .HasColumnName("Date_Sent")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Seen)
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'");

                entity.Property(e => e.TypeId).HasColumnName("Type_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.TypeId)
                    .HasConstraintName("Notification_ibfk_1");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("Notification_ibfk_2");
            });

            modelBuilder.Entity<NotificationType>(entity =>
            {
                entity.HasKey(e => e.TypeId)
                    .HasName("PRIMARY");

                entity.ToTable("Notification_Type");

                entity.Property(e => e.TypeId).HasColumnName("Type_Id");

                entity.Property(e => e.Name).HasMaxLength(100);
            });

            modelBuilder.Entity<PasswordResetAttempt>(entity =>
            {
                entity.ToTable("Password_Reset_Attempt");

                entity.Property(e => e.ConfirmationCode)
                    .HasMaxLength(50)
                    .HasColumnName("Confirmation_Code");

                entity.Property(e => e.Confirmed)
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.Expires).HasColumnType("timestamp");

                entity.Property(e => e.IpAddress)
                    .HasMaxLength(100)
                    .HasColumnName("IP_Address");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.Property(e => e.Used)
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'");

                entity.Property(e => e.UserId).HasColumnName("User_Id");
            });

            modelBuilder.Entity<PatientDoctor>(entity =>
            {
                entity.HasKey(e => new { e.PatientId, e.DoctorId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("Patient_Doctor");

                entity.HasIndex(e => e.DoctorId, "Doctor_Id");

                entity.HasIndex(e => e.TypeId, "Type_Id");

                entity.Property(e => e.PatientId).HasColumnName("Patient_Id");

                entity.Property(e => e.DoctorId).HasColumnName("Doctor_Id");

                entity.Property(e => e.ApprovalCode)
                    .HasMaxLength(60)
                    .HasColumnName("Approval_Code");

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

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.PatientDoctors)
                    .HasForeignKey(d => d.DoctorId)
                    .HasConstraintName("Patient_Doctor_ibfk_1");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.PatientDoctors)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("Patient_Doctor_ibfk_2");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.PatientDoctors)
                    .HasForeignKey(d => d.TypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Patient_Doctor_ibfk_3");
            });

            modelBuilder.Entity<PatientDoctorType>(entity =>
            {
                entity.HasKey(e => e.TypeId)
                    .HasName("PRIMARY");

                entity.ToTable("Patient_Doctor_Type");

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

            modelBuilder.Entity<PatientNextOfKin>(entity =>
            {
                entity.ToTable("Patient_Next_Of_Kin");

                entity.HasIndex(e => e.PatientId, "Patient_Id");

                entity.Property(e => e.PatientNextOfKinId).HasColumnName("Patient_Next_Of_Kin_Id");

                entity.Property(e => e.Cellphone).HasMaxLength(16);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.Email).HasMaxLength(100);

                entity.Property(e => e.FullName)
                    .HasMaxLength(200)
                    .HasColumnName("Full_Name");

                entity.Property(e => e.PatientId).HasColumnName("Patient_Id");

                entity.Property(e => e.Relationship).HasMaxLength(100);

                entity.Property(e => e.ResidentialAddress)
                    .HasMaxLength(300)
                    .HasColumnName("Residential_Address");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.PatientNextOfKins)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("Patient_Next_Of_Kin_ibfk_1");
            });

            modelBuilder.Entity<PatientProfile>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PRIMARY");

                entity.ToTable("Patient_Profile");

                entity.HasIndex(e => e.BloodTypeId, "Blood_Type_Id");

                entity.HasIndex(e => e.GenderId, "Gender_Id");

                entity.HasIndex(e => e.MedicalAidSchemeId, "Medical_Aid_Scheme_Id");

                entity.Property(e => e.UserId)
                    .ValueGeneratedNever()
                    .HasColumnName("User_Id");

                entity.Property(e => e.BloodTypeId).HasColumnName("Blood_Type_Id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp")
                    .HasColumnName("Created_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.GenderId).HasColumnName("Gender_Id");

                entity.Property(e => e.IdNumber)
                    .HasMaxLength(11)
                    .HasColumnName("ID_Number");

                entity.Property(e => e.MedicalAidSchemeId).HasColumnName("Medical_Aid_Scheme_Id");

                entity.Property(e => e.MemberNumber)
                    .HasMaxLength(50)
                    .HasColumnName("Member_Number");

                entity.Property(e => e.Nationality).HasMaxLength(100);

                entity.Property(e => e.PostalAddress)
                    .HasMaxLength(200)
                    .HasColumnName("Postal_Address");

                entity.Property(e => e.ResidentialAddress)
                    .HasMaxLength(300)
                    .HasColumnName("Residential_Address");

                entity.Property(e => e.SecondaryCellphone)
                    .HasMaxLength(16)
                    .HasColumnName("Secondary_Cellphone");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("timestamp")
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("Updated_At")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedBy).HasColumnName("Updated_By");

                entity.HasOne(d => d.BloodType)
                    .WithMany(p => p.PatientProfiles)
                    .HasForeignKey(d => d.BloodTypeId)
                    .HasConstraintName("Patient_Profile_ibfk_4");

                entity.HasOne(d => d.Gender)
                    .WithMany(p => p.PatientProfiles)
                    .HasForeignKey(d => d.GenderId)
                    .HasConstraintName("Patient_Profile_ibfk_3");

                entity.HasOne(d => d.MedicalAidScheme)
                    .WithMany(p => p.PatientProfiles)
                    .HasForeignKey(d => d.MedicalAidSchemeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("Patient_Profile_ibfk_2");

                entity.HasOne(d => d.User)
                    .WithOne(p => p.PatientProfile)
                    .HasForeignKey<PatientProfile>(d => d.UserId)
                    .HasConstraintName("Patient_Profile_ibfk_1");
            });

            modelBuilder.Entity<PatientProfileAccess>(entity =>
            {
                entity.HasKey(e => new { e.DoctorId, e.PatientId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("Patient_Profile_Access");

                entity.HasIndex(e => e.PatientId, "Patient_Id");

                entity.Property(e => e.DoctorId).HasColumnName("Doctor_Id");

                entity.Property(e => e.PatientId).HasColumnName("Patient_Id");

                entity.Property(e => e.ApprovalCode)
                    .HasMaxLength(40)
                    .HasColumnName("Approval_Code");

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.PatientProfileAccesses)
                    .HasForeignKey(d => d.DoctorId)
                    .HasConstraintName("Patient_Profile_Access_ibfk_1");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.PatientProfileAccesses)
                    .HasForeignKey(d => d.PatientId)
                    .HasConstraintName("Patient_Profile_Access_ibfk_2");
            });

            modelBuilder.Entity<Receptionist>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.DoctorId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("Receptionist");

                entity.HasIndex(e => e.DoctorId, "Doctor_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.Property(e => e.DoctorId).HasColumnName("Doctor_Id");

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

                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.Receptionists)
                    .HasForeignKey(d => d.DoctorId)
                    .HasConstraintName("Receptionist_ibfk_2");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Receptionists)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("Receptionist_ibfk_1");
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

                entity.Property(e => e.IsActive)
                    .HasColumnType("bit(1)")
                    .HasColumnName("isActive");

                entity.Property(e => e.IsConfirmed).HasColumnType("bit(1)");

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
