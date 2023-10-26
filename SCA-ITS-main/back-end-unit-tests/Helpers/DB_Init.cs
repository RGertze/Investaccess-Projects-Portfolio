using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace back_end_unit_tests.Helpers;

public class DB_Init
{
    public static void InitDbForTests(SCA_ITSContext dbContext)
    {
        // create default user types
        List<UserType> userTypes = new List<UserType>(){
            new UserType(){
                UserTypeId=1,
                UserTypeName="Admin"
            },
            new UserType(){
                UserTypeId=2,
                UserTypeName="Parent"
            },
            new UserType(){
                UserTypeId=3,
                UserTypeName="Staff"
            },
            new UserType(){
                UserTypeId=4,
                UserTypeName="Student"
            }
        };
        dbContext.UserTypes.AddRange(userTypes);
        dbContext.SaveChanges();

        // create default contact detail types
        List<ContactDetailsType> contactDetailsTypes = new List<ContactDetailsType>(){
            new ContactDetailsType(){
                TypeId=1,
                TypeName="Cell"
            },
            new ContactDetailsType(){
                TypeId=2,
                TypeName="Email"
            }
        };
        dbContext.ContactDetailsTypes.AddRange(contactDetailsTypes);
        dbContext.SaveChanges();

        // create default required registration docs for parents
        List<RequiredRegistrationDocument> parentRequiredRegistrationDocs = new List<RequiredRegistrationDocument>(){
            new RequiredRegistrationDocument(){
                Id=1,
                UserTypeId=2,
                Name="Proof of Residence",
                Description="Document such as a water bill that will provide proof of residence"
            },
            new RequiredRegistrationDocument(){
                Id=2,
                UserTypeId=2,
                Name="Certified ID Copy",
                Description="A copy of your ID that has been stamped and certified by the police"
            },
            new RequiredRegistrationDocument(){
                Id=3,
                UserTypeId=2,
                Name="Proof of Registration Fee Payment",
                Description="A document such as a bank statement proving that the registration fee has been paid"
            },
        };
        dbContext.RequiredRegistrationDocuments.AddRange(parentRequiredRegistrationDocs);
        dbContext.SaveChanges();

        // create default required registration docs for students
        List<RequiredRegistrationDocument> studentRequiredRegistrationDocs = new List<RequiredRegistrationDocument>(){
            new RequiredRegistrationDocument(){
                Id=4,
                UserTypeId=4,
                Name="Latest Report Card",
                Description="A report card for the previous year or term."
            }
        };
        dbContext.RequiredRegistrationDocuments.AddRange(studentRequiredRegistrationDocs);
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
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1,
                IsApproved=1
            },
            // Another Admin
            new UserAccount()
            {
                UserId=4,
                UserTypeId = 1,
                Email = "admin1@gmail.com",
                Password = "pw",
                FirstName = "admin",
                LastName = "Administrator",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1,
                IsApproved=1,

                RefreshToken="101"
            },
            // Parent
            new UserAccount()
            {
                UserId=2,
                UserTypeId = 2,
                Email = "parent@gmail.com",
                Password = "pw",
                FirstName = "unreasonable",
                LastName = "parent",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1,
                IsApproved=1
            },
            // Another Parent
            new UserAccount()
            {
                UserId=5,
                UserTypeId = 2,
                Email = "parent1@gmail.com",
                Password = "pw",
                FirstName = "unreasonable",
                LastName = "parent",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1,
                IsApproved=0
            },
            // Staff
            new UserAccount()
            {
                UserId=3,
                UserTypeId = 3,
                Email = "staff@gmail.com",
                Password = "pw",
                FirstName = "incompetent",
                LastName = "staff",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1,
                IsApproved=1
            },
            // Staff
            new UserAccount()
            {
                UserId=6,
                UserTypeId = 3,
                Email = "staff1@gmail.com",
                Password = "pw",
                FirstName = "incompetent",
                LastName = "staff",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1,
                IsApproved=1
            },
            // Staff
            new UserAccount()
            {
                UserId=7,
                UserTypeId = 3,
                Email = "staff2@gmail.com",
                Password = "pw",
                FirstName = "incompetent",
                LastName = "staff",
                ConfirmationCode = "101",
                IsConfirmed = 1,
                IsActive = 1,
                IsApproved=1
            }
        };
        dbContext.UserAccounts.AddRange(users);
        dbContext.SaveChanges();

        // create default parents
        List<Parent> parents = new List<Parent>(){
            new Parent(){
                UserId=2,
                RegistrationStage=(int)PARENT_REGISTRATION_STATUS.APPROVED
            },
            new Parent(){
                UserId=5,
                RegistrationStage=(int)PARENT_REGISTRATION_STATUS.ADD_DETAILS
            }
        };
        dbContext.Parents.AddRange(parents);
        dbContext.SaveChanges();

        // create default parent registration statuses
        List<ParentRegistrationStatus> parentRegistrationStatuses = new List<ParentRegistrationStatus>(){
            new ParentRegistrationStatus(){
                ParentId=2,
                DetailsAdded=0,
                OtherParentsAdded=0,
                StudentsAdded=0,
                RequiredDocsAdded=0,
                RegistrationFeePaid=0,
            },
            new ParentRegistrationStatus(){
                ParentId=5,
                DetailsAdded=0,
                OtherParentsAdded=0,
                StudentsAdded=0,
                RequiredDocsAdded=0,
                RegistrationFeePaid=0,
            },
        };
        dbContext.ParentRegistrationStatuses.AddRange(parentRegistrationStatuses);
        dbContext.SaveChanges();

        // create default fees for grades
        List<FeesForGrade> feesForGrades = new List<FeesForGrade>(){
            new FeesForGrade()
            {
                Grade=0,
                Amount=200
            },
            new FeesForGrade()
            {
                Grade=1,
                Amount=200
            },
            new FeesForGrade()
            {
                Grade=2,
                Amount=200
            },
            new FeesForGrade()
            {
                Grade=3,
                Amount=200
            },
            new FeesForGrade()
            {
                Grade=4,
                Amount=200
            },
            new FeesForGrade()
            {
                Grade=5,
                Amount=200
            },
            new FeesForGrade()
            {
                Grade=6,
                Amount=200
            },
            new FeesForGrade()
            {
                Grade=7,
                Amount=200
            },
        };
        dbContext.FeesForGrades.AddRange(feesForGrades);
        dbContext.SaveChanges();

        // create default financial statements
        List<ParentFinancialStatement> parentFinancialStatements = new List<ParentFinancialStatement>(){
            new ParentFinancialStatement()
            {
                ParentId=5,
                CurrentBalance=0,
            },
        };
        dbContext.ParentFinancialStatements.AddRange(parentFinancialStatements);
        dbContext.SaveChanges();

        // create default proof of deposits
        List<ProofOfDeposit> proofOfDeposits = new List<ProofOfDeposit>(){
            new ProofOfDeposit()
            {
                Id=1,
                ParentId=5,
                Amount=100,
                FilePath="file path",
                FileName="a name",
                RejectionMessage="",
                Status=1
            },
            new ProofOfDeposit()
            {
                Id=2,
                ParentId=5,
                Amount=100,
                FilePath="file path",
                FileName="a name",
                RejectionMessage="",
                Status=3
            },
            new ProofOfDeposit()
            {
                Id=3,
                ParentId=5,
                Amount=100,
                FilePath="file path",
                FileName="a name",
                RejectionMessage="",
                Status=2
            },
            new ProofOfDeposit()
            {
                Id=4,
                ParentId=5,
                Amount=100,
                FilePath="file path",
                FileName="a name",
                RejectionMessage="",
                Status=1
            },
            new ProofOfDeposit()
            {
                Id=5,
                ParentId=5,
                Amount=100,
                FilePath="file path",
                FileName="a name",
                RejectionMessage="",
                Status=1
            },



            new ProofOfDeposit()
            {
                Id=6,
                ParentId=5,
                Amount=100,
                FilePath="file path",
                FileName="a name",
                RejectionMessage="",
                Status=1
            },
        };
        dbContext.ProofOfDeposits.AddRange(proofOfDeposits);
        dbContext.SaveChanges();

        // create default parent registration files
        List<ParentRegistrationFile> parentRegFiles = new List<ParentRegistrationFile>(){
            new ParentRegistrationFile(){
                FilePath = "some-file-path-1",
                RequiredId = 1,
                UserId = 2,
                Name = "idgaf"
            }
        };
        dbContext.ParentRegistrationFiles.AddRange(parentRegFiles);
        dbContext.SaveChanges();

        // create default students
        List<Student> students = new List<Student>(){
            new Student(){
                StudentNumber="220038627",
                FirstName="fn",
                LastName="ln",
                Grade=3,
                RegistrationStage=(int)STUDENT_REGISTRATION_STATUS.APPROVED,
                ParentId=2
            },
            new Student(){
                StudentNumber="220038628",
                FirstName="fn",
                LastName="ln",
                Grade=3,
                RegistrationStage=(int)STUDENT_REGISTRATION_STATUS.APPROVED,
                ParentId=2
            },
            new Student(){
                StudentNumber="1234",
                FirstName="fn",
                LastName="ln",
                Grade=0,
                RegistrationStage=(int)STUDENT_REGISTRATION_STATUS.APPROVED,
                ParentId=5
            },
        };
        dbContext.Students.AddRange(students);
        dbContext.SaveChanges();

        // create default student registration statuses
        List<StudentRegistrationStatus> studentRegistrationStatuses = new List<StudentRegistrationStatus>(){
            new StudentRegistrationStatus(){
                StudentNumber="220038627",
                BasicDetailsAdded=0,
                GeneralInfoAdded=0,
                ReligiousInfoAdded=0,
                ScholasticInfoAdded=0,
                MedicalInfoAdded=0,
                MedicalConditionsAdded=0,
                OtherParentsAdded=0,
                NonScaStudentsAdded=0,
                RequiredDocsAdded=0,
                OccupationalTherapyNeeded=0,
                OccupationalReportAdded=0,
                DiagnosticTestNeeded=0,
                DiagnosticResultAdded=0,
            },
            new StudentRegistrationStatus(){
                StudentNumber="220038628",
                BasicDetailsAdded=0,
                GeneralInfoAdded=0,
                ReligiousInfoAdded=0,
                ScholasticInfoAdded=0,
                MedicalInfoAdded=0,
                MedicalConditionsAdded=0,
                OtherParentsAdded=0,
                NonScaStudentsAdded=0,
                RequiredDocsAdded=0,
                OccupationalTherapyNeeded=0,
                OccupationalReportAdded=0,
                DiagnosticTestNeeded=0,
                DiagnosticResultAdded=0,
            },
            new StudentRegistrationStatus(){
                StudentNumber="1234",
                BasicDetailsAdded=0,
                GeneralInfoAdded=0,
                ReligiousInfoAdded=0,
                ScholasticInfoAdded=0,
                MedicalInfoAdded=0,
                MedicalConditionsAdded=0,
                OtherParentsAdded=0,
                NonScaStudentsAdded=0,
                RequiredDocsAdded=0,
                OccupationalTherapyNeeded=0,
                OccupationalReportAdded=0,
                DiagnosticTestNeeded=0,
                DiagnosticResultAdded=0,
            },
        };
        dbContext.StudentRegistrationStatuses.AddRange(studentRegistrationStatuses);
        dbContext.SaveChanges();

        // create default student registration files
        List<StudentRegistrationFile> studentRegFiles = new List<StudentRegistrationFile>(){
            new StudentRegistrationFile(){
                FilePath = "some-file-path-1",
                RequiredId = 1,
                StudentNumber="220038627",
                Name = "idgaf"
            }
        };
        dbContext.StudentRegistrationFiles.AddRange(studentRegFiles);
        dbContext.SaveChanges();

        // create default course categories
        List<CourseCategory> courseCategories = new List<CourseCategory>(){
            new CourseCategory(){
                Id = 1,
                MoodleId=1,
                ParentCategoryId=0,
                Name = "Default",
                Description="First category"
            },
            new CourseCategory(){
                Id = 2,
                MoodleId=2,
                ParentCategoryId=0,
                Name = "Category 2",
                Description="2nd category"
            },
            new CourseCategory(){
                Id = 3,
                MoodleId=3,
                ParentCategoryId=0,
                Name = "Category 3",
                Description="3rd category"
            },
            new CourseCategory(){
                Id = 4,
                MoodleId=4,
                ParentCategoryId=0,
                Name = "Category 4",
                Description="4th category"
            },
        };
        dbContext.CourseCategories.AddRange(courseCategories);
        dbContext.SaveChanges();

        // create default course types
        List<CourseType> courseTypes = new List<CourseType>(){
            new CourseType(){
                Id = 1,
                Name = "Core",
            },
            new CourseType(){
                Id = 2,
                Name = "Vocational",
            },
            new CourseType(){
                Id = 3,
                Name = "Support",
            },
        };
        dbContext.CourseTypes.AddRange(courseTypes);
        dbContext.SaveChanges();

        // create default courses
        List<Course> courses = new List<Course>(){
            new Course(){
                Id = "MATH4",
                MoodleId=1,
                CategoryId=2,

                Name = "Mathematics for grade 4",
                Grade = 4,

                TypeId=1,
                IsPromotional=1
            },
            new Course(){
                Id = "MATH7",
                MoodleId=2,
                CategoryId=2,

                Name = "Mathematics for grade 7",
                Grade = 7,

                TypeId=1,
                IsPromotional=1
            },
            new Course(){
                Id = "MATH6",
                MoodleId=3,
                CategoryId=2,

                Name = "Mathematics for grade 6",
                Grade = 6,

                TypeId=1,
                IsPromotional=1
            }
        };
        dbContext.Courses.AddRange(courses);
        dbContext.SaveChanges();

        // create default course staff
        List<CourseStaff> courseStaff = new List<CourseStaff>(){
            new CourseStaff(){
                CourseId= "MATH4",
                StaffId=6
            },
            new CourseStaff(){
                CourseId= "MATH7",
                StaffId=6
            }
        };
        dbContext.CourseStaffs.AddRange(courseStaff);
        dbContext.SaveChanges();

        // create default course students
        List<CourseStudent> courseStudents = new List<CourseStudent>(){
            new CourseStudent(){
                CourseId= "MATH4",
                StudentNumber="220038628"
            },
            new CourseStudent(){
                CourseId= "MATH7",
                StudentNumber="220038627"
            }
        };
        dbContext.CourseStudents.AddRange(courseStudents);
        dbContext.SaveChanges();

        // create default progress reports
        List<ProgressReportTemplate> progReps = new List<ProgressReportTemplate>(){
            new ProgressReportTemplate(){
                Id=1,
                Name = "Math 7 template",
                ExamMarksAvailable=100,
                ExamWeight = 80
            },
            new ProgressReportTemplate(){
                Id=2,
                Name = "Eng 7 template",
                ExamMarksAvailable=100,
                ExamWeight = 80
            },
            new ProgressReportTemplate(){
                Id=3,
                Name = "SOC 7 template",
                ExamMarksAvailable=100,
                ExamWeight = 80
            },
            new ProgressReportTemplate(){
                Id=4,
                Name = "SOC 7 template",
                ExamMarksAvailable=100,
                ExamWeight = 80
            },
        };
        dbContext.ProgressReportTemplates.AddRange(progReps);
        dbContext.SaveChanges();

        // create default progress report categories
        List<ProgressReportCategory> progRepCats = new List<ProgressReportCategory>(){
            new ProgressReportCategory(){
                Id=1,
                ProgressReportId=1,
                Name = "jkdsnf",
                Weight = 60
            },
            new ProgressReportCategory(){
                Id=2,
                ProgressReportId=1,
                Name = "jkdsnfaa",
                Weight = 10
            },
            new ProgressReportCategory(){
                Id=3,
                ProgressReportId=1,
                Name = "jkdsnfaaaaaaa",
                Weight = 5
            },
        };
        dbContext.ProgressReportCategories.AddRange(progRepCats);
        dbContext.SaveChanges();

        // create default category assessments
        List<ProgressReportAssessment> catAssessments = new List<ProgressReportAssessment>(){
            new ProgressReportAssessment(){
                Id=1,
                Name = "exists1",
                ProgressReportCategoryId=2,
                MarksAvailable=20
            },
            new ProgressReportAssessment(){
                Id=2,
                Name = "exists",
                ProgressReportCategoryId=2,
                MarksAvailable=20
            },
            new ProgressReportAssessment(){
                Id=3,
                Name = "exists2",
                ProgressReportCategoryId=2,
                MarksAvailable=10
            },
            new ProgressReportAssessment(){
                Id=4,
                Name = "exists3",
                ProgressReportCategoryId=2,
                MarksAvailable=10
            },
        };
        dbContext.ProgressReportAssessments.AddRange(catAssessments);
        dbContext.SaveChanges();

        // create default course progress reports
        List<CourseProgressReport> coursePrgReports = new List<CourseProgressReport>(){
            new CourseProgressReport(){
                Id=1,
                CourseId="MATH6",
                ProgressReportId=1,
                NumberOfTerms=4,
                Year=2022
            },
            new CourseProgressReport(){
                Id=2,
                CourseId="MATH7",
                ProgressReportId=1,
                NumberOfTerms=4,
                Year=2022
            }
        };
        dbContext.CourseProgressReports.AddRange(coursePrgReports);
        dbContext.SaveChanges();

        // create default student progress reports
        List<StudentProgressReport> studentPrgReports = new List<StudentProgressReport>(){
            new StudentProgressReport(){
                CourseProgressReportId=1,
                StudentNumber="220038627",
            },
        };
        dbContext.StudentProgressReports.AddRange(studentPrgReports);
        dbContext.SaveChanges();

        // create default student assessments
        List<StudentProgressReportAssessment> studentAssessments = new List<StudentProgressReportAssessment>(){
            new StudentProgressReportAssessment(){
                Id=1,
                StudentProgressReportId=1,
                ProgressReportAssessmentId=1,
                Term=1
            },
            new StudentProgressReportAssessment(){
                Id=2,
                StudentProgressReportId=1,
                ProgressReportAssessmentId=2,
                Term=1
            },
        };
        dbContext.StudentProgressReportAssessments.AddRange(studentAssessments);
        dbContext.SaveChanges();

        // create default student exam marks
        List<StudentProgressReportExamMark> studentExamMarks = new List<StudentProgressReportExamMark>(){
            new StudentProgressReportExamMark(){
                Id=1,
                StudentProgressReportId=1,
                Term=1
            },
            new StudentProgressReportExamMark(){
                Id=2,
                StudentProgressReportId=1,
                Term=2
            },
        };
        dbContext.StudentProgressReportExamMarks.AddRange(studentExamMarks);
        dbContext.SaveChanges();

        // create default report groups
        List<ReportGroup> reportGroups = new List<ReportGroup>(){
            new ReportGroup(){
                Id=1,
                Year=2021,
                Terms=4
            },
            new ReportGroup(){
                Id=2,
                Year=2022,
                Terms=4
            },
            new ReportGroup(){
                Id=3,
                Year=2100,
                Terms=4
            },
            new ReportGroup(){
                Id=4,
                Year=2101,
                Terms=4
            },
            new ReportGroup(){
                Id=5,
                Year=2102,
                Terms=4
            },

            // for report generation
            new ReportGroup(){
                Id=6,
                Year=2103,
                Terms=4
            },

            // latest report group for student registration approval test
            new ReportGroup(){
                Id=7,
                Year=2104,
                Terms=4
            },
        };
        dbContext.ReportGroups.AddRange(reportGroups);
        dbContext.SaveChanges();

        // create default report types
        List<ReportType> reportTypes = new List<ReportType>(){
            new ReportType(){
                Id=1,
                Name="Primary"
            },
            new ReportType(){
                Id=2,
                Name="Pre-primary"
            },
        };
        dbContext.ReportTypes.AddRange(reportTypes);
        dbContext.SaveChanges();

        // create default persona categories
        List<PersonaCategory> personaCategories = new List<PersonaCategory>(){
            new PersonaCategory(){
                Id=1,
                Name="Work habits"
            },
            new PersonaCategory(){
                Id=2,
                Name="Social Development"
            },
            new PersonaCategory(){
                Id=3,
                Name="Personal Development"
            },
        };
        dbContext.PersonaCategories.AddRange(personaCategories);
        dbContext.SaveChanges();

        // create default personas
        List<Persona> personas = new List<Persona>(){
            new Persona(){
                Id=1,
                PersonaCategoryId=1,
                Name="a"
            },
            new Persona(){
                Id=2,
                PersonaCategoryId=2,
                Name="b"
            },
            new Persona(){
                Id=3,
                PersonaCategoryId=3,
                Name="c"
            },
        };
        dbContext.Personas.AddRange(personas);
        dbContext.SaveChanges();

        // create default reports
        List<Report> reports = new List<Report>(){
            new Report(){
                Id=1,
                ReportGroupId=4,
                ReportTypeId=1,
                StudentNumber="220038627"
            },
            new Report(){
                Id=2,
                ReportGroupId=4,
                ReportTypeId=1,
                StudentNumber="220038628"
            },
            new Report(){
                Id=3,
                ReportGroupId=5,
                ReportTypeId=1,
                StudentNumber="220038628"
            },
            new Report(){
                Id=6,
                ReportGroupId=5,
                ReportTypeId=2,
                StudentNumber="1234"
            },
            
            // for report generation
            new Report(){
                Id=4,
                ReportGroupId=6,
                ReportTypeId=1,
                StudentNumber="220038628"
            },
            new Report(){
                Id=5,
                ReportGroupId=6,
                ReportTypeId=1,
                StudentNumber="220038627"
            },
        };
        dbContext.Reports.AddRange(reports);
        dbContext.SaveChanges();

        // create default primary reports details
        List<PrimaryReportDetail> primaryReportDetails = new List<PrimaryReportDetail>(){
            new PrimaryReportDetail(){
                Id=1,
                ReportId=1,
                DaysAbsent=10,
                PersonaBriefComments="",
                RegisterTeacher=""
            },
        };
        dbContext.PrimaryReportDetails.AddRange(primaryReportDetails);
        dbContext.SaveChanges();

        // create default pre primary reports details
        List<PrePrimaryReportDetail> prePrimaryReportDetails = new List<PrePrimaryReportDetail>(){
            new PrePrimaryReportDetail(){
                Id=1,
                ReportId=6,
                DaysAbsent=10,
                DominantHand=1,
                RegisterTeacher=""
            },
        };
        dbContext.PrePrimaryReportDetails.AddRange(prePrimaryReportDetails);
        dbContext.SaveChanges();

        // create default course remarks
        List<CourseRemark> courseRemarks = new List<CourseRemark>(){
            new CourseRemark(){
                Id=1,
                CourseId="MATH4",
                ReportId=3,
                Remark="",
                Initials=""
            },

            // for report generation
            new CourseRemark(){
                Id=2,
                CourseId="MATH4",
                ReportId=4,
                Remark="",
                Initials=""
            },
            new CourseRemark(){
                Id=3,
                CourseId="MATH4",
                ReportId=5,
                Remark="",
                Initials=""
            },
        };
        dbContext.CourseRemarks.AddRange(courseRemarks);
        dbContext.SaveChanges();

        // create default persona grades
        List<PersonaGrade> personaGrades = new List<PersonaGrade>(){
            new PersonaGrade(){
                Id=1,
                PersonaId=1,
                Term=1,
                ReportId=3,
                Grade="",
            },

            // for report generation
            new PersonaGrade(){
                Id=2,
                PersonaId=1,
                Term=1,
                ReportId=4,
                Grade="",
            },
            new PersonaGrade(){
                Id=3,
                PersonaId=1,
                Term=1,
                ReportId=5,
                Grade="",
            },
        };
        dbContext.PersonaGrades.AddRange(personaGrades);
        dbContext.SaveChanges();

        // create default dev groups
        List<DevelopmentGroup> developmentGroups = new List<DevelopmentGroup>(){
            new DevelopmentGroup(){
                Id=1,
                Name="PREPARATORY MATHEMATICS"
            },
        };
        dbContext.DevelopmentGroups.AddRange(developmentGroups);
        dbContext.SaveChanges();

        // create default dev categories
        List<DevelopmentCategory> developmentCategories = new List<DevelopmentCategory>(){
            new DevelopmentCategory(){
                Id=1,
                GroupId=1,
                Name="Number Concept"
            },
        };
        dbContext.DevelopmentCategories.AddRange(developmentCategories);
        dbContext.SaveChanges();

        // create default dev assessments
        List<DevelopmentAssessment> developmentAssessments = new List<DevelopmentAssessment>(){
            new DevelopmentAssessment(){
                Id=1,
                CategoryId=1,
                Name="Count mechanically"
            },
            new DevelopmentAssessment(){
                Id=2,
                CategoryId=1,
                Name="Identify numerals "
            },
        };
        dbContext.DevelopmentAssessments.AddRange(developmentAssessments);
        dbContext.SaveChanges();

        // create default pre primary report groups
        List<PrePrimaryProgressReport> prePrimaryProgressReports = new List<PrePrimaryProgressReport>()
        {
            new PrePrimaryProgressReport{
                Id=1,
                Terms=4,
                Year=2023
            },
        };
        dbContext.PrePrimaryProgressReports.AddRange(prePrimaryProgressReports);
        dbContext.SaveChanges();

        // create default student pre primary report groups
        List<StudentPrePrimaryProgressReport> studentPrePrimaryProgressReports = new List<StudentPrePrimaryProgressReport>()
        {
            new StudentPrePrimaryProgressReport{
                Id=1,
                ProgressReportId=1,
                StudentNumber="1234"
            },
        };
        dbContext.StudentPrePrimaryProgressReports.AddRange(studentPrePrimaryProgressReports);
        dbContext.SaveChanges();

        // create default dev assessment grades
        List<DevelopmentAssessmentGrade> developmentAssessmentGrades = new List<DevelopmentAssessmentGrade>(){
            new DevelopmentAssessmentGrade(){
                Id=1,
                AssessmentId=1,
                Term=1,
                StudentProgressReportId=1,
                Grade="",
            },
            new DevelopmentAssessmentGrade(){
                Id=2,
                AssessmentId=2,
                Term=1,
                StudentProgressReportId=1,
                Grade="",
            },
        };
        dbContext.DevelopmentAssessmentGrades.AddRange(developmentAssessmentGrades);
        dbContext.SaveChanges();

        // create default report generation jobs
        List<ReportGenerationJob> reportGenJobs = new List<ReportGenerationJob>(){
            new ReportGenerationJob(){
                Id=1,
                ReportGroupId=6,
                Term=1,
                SchoolReOpens=DateOnly.Parse("10/15/2022")
            },
            new ReportGenerationJob(){
                Id=2,
                ReportGroupId=1,
                Term=1,
                SchoolReOpens=DateOnly.Parse("10/15/2022")
            },
        };
        dbContext.ReportGenerationJobs.AddRange(reportGenJobs);
        dbContext.SaveChanges();

        // create default report generation jobs
        List<FileToDelete> filesToDelete = new List<FileToDelete>(){
            new FileToDelete(){
                FilePath="path-1",
                FileName="name"
            },
            new FileToDelete(){
                FilePath="path-2",
                FileName="name"
            },
        };
        dbContext.FileToDeletes.AddRange(filesToDelete);
        dbContext.SaveChanges();
    }
}