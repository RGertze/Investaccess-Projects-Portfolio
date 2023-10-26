using System.Text.Json;
using iPulse_back_end.DB_Models;
using iPulse_back_end.Helpers.Enums;
using Microsoft.EntityFrameworkCore;

namespace back_end_tests.Helpers;

public class DB_Init
{
    public static void InitDbForTests(IPulseContext dbContext)
    {
        // create default user types
        List<UserType> userTypes = new List<UserType>(){
            new UserType(){
                UserTypeId=1,
                UserTypeName="Admin"
            },
            new UserType(){
                UserTypeId=2,
                UserTypeName="Doctor"
            },
            new UserType(){
                UserTypeId=3,
                UserTypeName="Patient"
            },
            new UserType(){
                UserTypeId=4,
                UserTypeName="Receptionist"
            }
        };
        dbContext.UserTypes.AddRange(userTypes);
        dbContext.SaveChanges();

        // create default specialties
        List<DoctorSpecialty> specialities = new List<DoctorSpecialty>(){
            new DoctorSpecialty(){
                SpecialtyId=1,
                SpecialtyName="None"
            },
            new DoctorSpecialty(){
                SpecialtyId=2,
                SpecialtyName="Oncologist"
            },
            new DoctorSpecialty(){
                SpecialtyId=3,
                SpecialtyName="Pediatrician"
            },
            new DoctorSpecialty(){
                SpecialtyId=4,
                SpecialtyName="idk"
            }
        };
        dbContext.DoctorSpecialties.AddRange(specialities);
        dbContext.SaveChanges();

        // create default medical schemes
        List<MedicalAidScheme> schemes = new List<MedicalAidScheme>(){
            new MedicalAidScheme(){
                MedicalAidSchemeId=1,
                MedicalAidSchemeName="Private"
            },
            new MedicalAidScheme(){
                MedicalAidSchemeId=2,
                MedicalAidSchemeName="NHP"
            }
        };
        dbContext.MedicalAidSchemes.AddRange(schemes);
        dbContext.SaveChanges();

        // create default genders
        List<Gender> genders = new List<Gender>(){
            new Gender(){
                GenderId=1,
                GenderName="Private"
            },
            new Gender(){
                GenderId=2,
                GenderName="NHP"
            }
        };
        dbContext.Genders.AddRange(genders);
        dbContext.SaveChanges();

        // create default users
        List<UserAccount> users = new List<UserAccount>(){
            // Admin
            new UserAccount()
            {
                UserId=1,
                UserTypeId = 1,
                Email = "admin@gmail.com",
                Password = "pw",
                FirstName = "admin",
                LastName = "Administrator",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            },
            // Another Admin
            new UserAccount()
            {
                UserId=9,
                UserTypeId = 1,
                Email = "admin1@gmail.com",
                Password = "pw",
                FirstName = "admin",
                LastName = "Administrator",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1,

                RefreshToken="101"
            },
            // One more Admin
            new UserAccount()
            {
                UserId=15,
                UserTypeId = 1,
                Email = "admin2@gmail.com",
                Password = "pw",
                FirstName = "admin",
                LastName = "Administrator",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1,

                RefreshToken="101"
            },
            // Doctor
            new UserAccount()
            {
                UserId=2,
                UserTypeId = 2,
                Email = "doc@gmail.com",
                Password = "pw",
                FirstName = "doctor",
                LastName = "proctor",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            },
            // Another Doctor
            new UserAccount()
            {
                UserId=3,
                UserTypeId = 2,
                Email = "doc1@gmail.com",
                Password = "pw",
                FirstName = "doctor",
                LastName = "proctor",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            },
            // One more Doctor
            new UserAccount()
            {
                UserId=6,
                UserTypeId = 2,
                Email = "doc2@gmail.com",
                Password = "pw",
                FirstName = "doctor",
                LastName = "proctor",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            },
            // Another Doctor
            new UserAccount()
            {
                UserId=7,
                UserTypeId = 2,
                Email = "doc2@gmail.com",
                Password = "pw",
                FirstName = "doctor",
                LastName = "proctor",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            },
            // some more Doctor
            new UserAccount()
            {
                UserId=8,
                UserTypeId = 2,
                Email = "doc3@gmail.com",
                Password = "pw",
                FirstName = "doctor",
                LastName = "proctor",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            },
            // nog meer Doctor
            new UserAccount()
            {
                UserId=10,
                UserTypeId = 2,
                Email = "doc4@gmail.com",
                Password = "pw",
                FirstName = "doctor",
                LastName = "proctor",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            },
            //  Doctor, another one
            new UserAccount()
            {
                UserId=13,
                UserTypeId = 2,
                Email = "doc5@gmail.com",
                Password = "pw",
                FirstName = "doctor",
                LastName = "proctor",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            },
            // Patient
            new UserAccount()
            {
                UserId=4,
                UserTypeId = 3,
                Email = "patient@gmail.com",
                Password = "pw",
                FirstName = "unhealthy",
                LastName = "patient",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            },
            // Another patient
            new UserAccount()
            {
                UserId=5,
                UserTypeId = 3,
                Email = "patient1@gmail.com",
                Password = "pw",
                FirstName = "dead",
                LastName = "patient",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            },
            // one more patient
            new UserAccount()
            {
                UserId=14,
                UserTypeId = 3,
                Email = "patient2@gmail.com",
                Password = "pw",
                FirstName = "dead",
                LastName = "patient",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            },
            // Receptionist
            new UserAccount()
            {
                UserId=11,
                UserTypeId = 4,
                Email = "receptionist@gmail.com",
                Password = "pw",
                FirstName = "rece",
                LastName = "ptionist",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            },
            // Another receptionist
            new UserAccount()
            {
                UserId=12,
                UserTypeId = 4,
                Email = "receptionist12@gmail.com",
                Password = "pw",
                FirstName = "rece",
                LastName = "ptionist",
                ProfilePicPath = "",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1
            }
        };
        dbContext.UserAccounts.AddRange(users);
        dbContext.SaveChanges();

        // create default doctor profiles
        List<DoctorProfile> docProfs = new List<DoctorProfile>(){
            new DoctorProfile(){
                UserId=2,
                SpecialtyId=2,
                Nationality="Namibian",
                PracticeNumber="2002",
                PracticeName="Legit Doctor Inc",
                PracticeCity="Windhoek"
            },
            new DoctorProfile(){
                UserId=6,
                SpecialtyId=3,
                Nationality="Namibian",
                PracticeNumber="2002",
                PracticeName="Legit Doctor Inc"
            },
            new DoctorProfile(){
                UserId=7,
                SpecialtyId=3,
                Nationality="Namibian",
                PracticeNumber="2002",
                PracticeName="Legit Doctor Inc"
            },
            new DoctorProfile(){
                UserId=8,
                SpecialtyId=3,
                Nationality="Namibian",
                PracticeNumber="2002",
                PracticeName="Legit Doctor Inc"
            },
            new DoctorProfile(){
                UserId=10,
                SpecialtyId=3,
                Nationality="Namibian",
                PracticeNumber="2002",
                PracticeName="Legit Doctor Inc",
                PracticeCity="Windhoek"
            },
            new DoctorProfile(){
                UserId=13,
                SpecialtyId=3,
                Nationality="Namibian",
                PracticeNumber="2002",
                PracticeName="Legit Doctor Inc",
                PracticeCity="Windhoek"
            }
        };
        dbContext.DoctorProfiles.AddRange(docProfs);
        dbContext.SaveChanges();

        // create default receptionists
        List<Receptionist> receptionists = new List<Receptionist>(){
            new Receptionist(){
                UserId=11,
                DoctorId=2
            },
            new Receptionist(){
                UserId=12,
                DoctorId=2
            }
        };
        dbContext.Receptionists.AddRange(receptionists);
        dbContext.SaveChanges();

        // create default password reset attempts
        List<PasswordResetAttempt> pwResetAttempts = new List<PasswordResetAttempt>(){
            new PasswordResetAttempt(){
                Id=1,
                UserId=12,
                ConfirmationCode="101",
                IpAddress="192.168.1.1",
                Expires= DateTime.UtcNow.AddMinutes(5)
            },
            new PasswordResetAttempt(){
                Id=2,
                UserId=4,
                ConfirmationCode="101",
                IpAddress="192.168.1.1",
                Expires= DateTime.UtcNow.AddMinutes(-15)
            },
            new PasswordResetAttempt(){
                Id=3,
                UserId=5,
                ConfirmationCode="101",
                IpAddress="192.168.1.1",
                Expires= DateTime.UtcNow.AddMinutes(15),
                Confirmed=1
            },
            new PasswordResetAttempt(){
                Id=4,
                UserId=6,
                ConfirmationCode="101",
                IpAddress="192.168.1.1",
                Expires= DateTime.UtcNow.AddMinutes(-15),
                Confirmed=1
            },
            new PasswordResetAttempt(){
                Id=5,
                UserId=7,
                ConfirmationCode="101",
                IpAddress="192.168.1.1",
                Expires= DateTime.UtcNow.AddMinutes(15),
                Confirmed=1,
                Used=1
            },
            new PasswordResetAttempt(){
                Id=6,
                UserId=8,
                ConfirmationCode="101",
                IpAddress="192.168.1.1",
                Expires= DateTime.UtcNow.AddMinutes(15),
                Confirmed=0,
                Used=0
            }
        };
        dbContext.PasswordResetAttempts.AddRange(pwResetAttempts);
        dbContext.SaveChanges();


        // create default work history
        List<DoctorWorkHistory> workHistory = new List<DoctorWorkHistory>(){
            new DoctorWorkHistory()
            {
                DoctorWorkHistoryId = 1,
                DoctorId = 2,
                CompanyName = "A company 123",
                StartDate = DateOnly.Parse("01/01/2001"),
                EndDate = DateOnly.Parse("01/01/2002"),
                Role = "Custodian and lead gardener",
                Duties = "Keep company premises clean. Perform routine maintenance tasks."
            },
            new DoctorWorkHistory()
            {
                DoctorWorkHistoryId = 2,
                DoctorId = 2,
                CompanyName = "A company 12345",
                StartDate = DateOnly.Parse("01/01/2001"),
                EndDate = DateOnly.Parse("01/01/2002"),
                Role = "Lawyer",
                Duties = "get out of jail free card. For a fee..."
            }
        };
        dbContext.DoctorWorkHistories.AddRange(workHistory);
        dbContext.SaveChanges();

        // create default education
        List<DoctorEducation> education = new List<DoctorEducation>(){
            new DoctorEducation()
            {
                DoctorId = 2,
                InstituteName="nust",
                QualificationName="doctorate of sweeping"
            },
        };
        dbContext.DoctorEducations.AddRange(education);
        dbContext.SaveChanges();

        // create defaul patient profiles
        List<PatientProfile> patientProfs = new List<PatientProfile>(){
            new PatientProfile(){
                UserId=4,
                MedicalAidSchemeId=2,
                IdNumber="11111111111",
                MemberNumber="2002"
            },
            new PatientProfile(){
                UserId=5,
                MedicalAidSchemeId=2,
                IdNumber="11111111111",
                MemberNumber="2002"
            }
        };
        dbContext.PatientProfiles.AddRange(patientProfs);
        dbContext.SaveChanges();

        // create defaul patient next of kin
        List<PatientNextOfKin> patientNextOfKin = new List<PatientNextOfKin>(){
            new PatientNextOfKin(){
                PatientNextOfKinId=1,
                PatientId=4,
                Email="em",
                Cellphone="00",
                FullName="name",
                Relationship="rel",
                ResidentialAddress="rel"
            },
            new PatientNextOfKin(){
                PatientNextOfKinId=2,
                PatientId=4,
                Email="emmmmm",
                Cellphone="00",
                FullName="name",
                Relationship="rel",
                ResidentialAddress="rel"
            },
        };
        dbContext.PatientNextOfKins.AddRange(patientNextOfKin);
        dbContext.SaveChanges();

        // create default appointment slots
        List<AppointmentSlot> appointmentSlots = new List<AppointmentSlot>(){
            new AppointmentSlot(){
                SlotId=1,
                DoctorId = 2,
                SlotDay = 1,
                StartTime = TimeOnly.Parse("10:30:00"),
                EndTime = TimeOnly.Parse("11:30:00")
            },
            new AppointmentSlot(){
                SlotId=2,
                DoctorId = 2,
                SlotDay = 7,
                StartTime = TimeOnly.Parse("14:30:00"),
                EndTime = TimeOnly.Parse("15:30:00")
            },
            new AppointmentSlot(){
                SlotId=3,
                DoctorId = 2,
                SlotDay = 7,
                StartTime = TimeOnly.Parse("17:30:00"),
                EndTime = TimeOnly.Parse("18:30:00")
            },
            new AppointmentSlot(){
                SlotId=4,
                DoctorId = 2,
                SlotDay = 6,
                StartTime = TimeOnly.Parse("17:30:00"),
                EndTime = TimeOnly.Parse("18:30:00")
            },
            new AppointmentSlot(){
                SlotId=5,
                DoctorId = 6,
                SlotDay = 7,
                StartTime = TimeOnly.Parse("10:00:00"),
                EndTime = TimeOnly.Parse("11:00:00")
            },
        };
        dbContext.AppointmentSlots.AddRange(appointmentSlots);
        dbContext.SaveChanges();

        // create default appointments
        List<Appointment> appointments = new List<Appointment>(){
            new Appointment(){
                AppointmentId=1,
                SlotId=2,
                PatientId = 4,
                Title = "some title",
                Description = "desc?",
                DateOf= new DateOnly(2023,07,25),
                Status=(int)Status.APPROVED,

                ConfirmationCode="101"
            },
            new Appointment(){
                AppointmentId=2,
                SlotId=3,
                PatientId = 4,
                Title = "some title",
                Description = "desc?",
                DateOf= new DateOnly(2023,07,25),
                Status=(int)Status.REJECTED,

                ConfirmationCode="101"
            },
            new Appointment(){
                AppointmentId=3,
                SlotId=3,
                PatientId = 4,
                Title = "some title",
                Description = "desc?",
                DateOf= new DateOnly(2023,01,25),
                Status=(int)Status.APPROVED,

                ConfirmationCode="101"
            },
            new Appointment(){
                AppointmentId=4,
                SlotId=2,
                PatientId = 4,
                Title = "some title",
                Description = "desc?",
                DateOf= new DateOnly(2023,01,25),
                Status=(int)Status.PENDING,

                ConfirmationCode="101"
            },
            new Appointment(){
                AppointmentId=6,
                SlotId=4,
                PatientId = 4,
                Title = "some title",
                Description = "desc?",
                DateOf= new DateOnly(2023,01,29),
                Status=(int)Status.APPROVED,

                ConfirmationCode="101"
            },
            new Appointment(){
                AppointmentId=7,
                SlotId=2,
                PatientId = 4,
                Title = "some title",
                Description = "desc?",
                DateOf= new DateOnly(2023,01,10),
                Status=(int)Status.PENDING,

                ConfirmationCode="101"
            },
            new Appointment(){
                AppointmentId=8,
                SlotId=2,
                PatientId = 4,
                Title = "some title",
                Description = "desc?",
                DateOf= new DateOnly(2023,01,9),
                Status=(int)Status.PENDING,

                ConfirmationCode="101"
            },
        };
        dbContext.Appointments.AddRange(appointments);
        dbContext.SaveChanges();

        // create default profile access
        List<PatientProfileAccess> profileAccess = new List<PatientProfileAccess>(){
            new PatientProfileAccess(){
                DoctorId=2,
                PatientId=4,
                ApprovalCode="101",
                Status=(int)Status.APPROVED
            },
            new PatientProfileAccess(){
                DoctorId=7,
                PatientId=4,
                ApprovalCode="101",
                Status=(int)Status.APPROVED
            },
            new PatientProfileAccess(){
                DoctorId=8,
                PatientId=4,
                ApprovalCode="101",
                Status=(int)Status.APPROVED
            },
            new PatientProfileAccess(){
                DoctorId=10,
                PatientId=4,
                ApprovalCode="101",
                Status=(int)Status.APPROVED
            },
        };
        dbContext.PatientProfileAccesses.AddRange(profileAccess);
        dbContext.SaveChanges();

        // create default patient doctor types
        List<PatientDoctorType> patientDoctorTypes = new List<PatientDoctorType>(){
            new PatientDoctorType(){
                TypeId=1,
                TypeName="Family"
            },
            new PatientDoctorType(){
                TypeId=2,
                TypeName="Pediatrician"
            },
            new PatientDoctorType(){
                TypeId=3,
                TypeName="OB-GYN"
            }
        };
        dbContext.PatientDoctorTypes.AddRange(patientDoctorTypes);
        dbContext.SaveChanges();

        // create default patient doctors
        List<PatientDoctor> patientDoctors = new List<PatientDoctor>(){
            new PatientDoctor(){
                PatientId=4,
                DoctorId=6,
                TypeId=1,
                Status=(int)Status.REJECTED,
                ApprovalCode="101"
            },
            new PatientDoctor(){
                PatientId=4,
                DoctorId=7,
                TypeId=1,
                Status=(int)Status.REJECTED,
                ApprovalCode="101"
            },
            new PatientDoctor(){
                PatientId=5,
                DoctorId=7,
                TypeId=1,
                Status=(int)Status.APPROVED,
                ApprovalCode="101"
            }
        };
        dbContext.PatientDoctors.AddRange(patientDoctors);
        dbContext.SaveChanges();

        // create default general health summaries
        List<GeneralHealthSummary> generalHealthSummaries = new List<GeneralHealthSummary>(){
            new GeneralHealthSummary(){
                Id=1,
                PatientId=4,
                DoctorId=2,
                Content=JsonSerializer.Serialize("{}"),
            },
            new GeneralHealthSummary(){
                Id=2,
                PatientId=4,
                DoctorId=2,
                Content=JsonSerializer.Serialize("{}"),
            },
            new GeneralHealthSummary(){
                Id=3,
                PatientId=4,
                DoctorId=2,
                Content=JsonSerializer.Serialize("{}"),
            },
            new GeneralHealthSummary(){
                Id=4,
                PatientId=4,
                DoctorId=2,
                Content=JsonSerializer.Serialize("{}"),
            },
        };
        dbContext.GeneralHealthSummaries.AddRange(generalHealthSummaries);
        dbContext.SaveChanges();

        // create default reviews
        List<DoctorReview> reviews = new List<DoctorReview>(){
            new DoctorReview()
            {
                ReviewId=1,
                DoctorId = 2,
                PatientId=4,
                Comment="nust",
                Rating=3
            },
        };
        dbContext.DoctorReviews.AddRange(reviews);
        dbContext.SaveChanges();

        // create default dms
        List<DirectMessage> dms = new List<DirectMessage>(){
            new DirectMessage()
            {
                FromId = 1,
                ToId = 2,
                Content = "hey"
            },
            new DirectMessage()
            {
                FromId = 1,
                ToId = 3,
                Content = "answer me"
            }
        };
        dbContext.DirectMessages.AddRange(dms);
        dbContext.SaveChanges();

        // create default notification types
        List<NotificationType> notifyTypes = new List<NotificationType>(){
            new NotificationType()
            {
                TypeId=1,
                Name="Message",
            },
            new NotificationType()
            {
                TypeId=2,
                Name="Appointment",
            },
            new NotificationType()
            {
                TypeId=3,
                Name="Profile Access",
            }
        };
        dbContext.NotificationTypes.AddRange(notifyTypes);
        dbContext.SaveChanges();

        // create default notifications
        List<Notification> notifys = new List<Notification>(){
            new Notification()
            {
                TypeId=1,
                UserId=2,
                Content=JsonSerializer.Serialize("hey")
            },
            new Notification()
            {
                TypeId=1,
                UserId=2,
                Content=JsonSerializer.Serialize("yo")
            },
            new Notification()
            {
                TypeId=1,
                UserId=2,
                Content=JsonSerializer.Serialize("hi")
            }
        };
        dbContext.Notifications.AddRange(notifys);
        dbContext.SaveChanges();
    }
}