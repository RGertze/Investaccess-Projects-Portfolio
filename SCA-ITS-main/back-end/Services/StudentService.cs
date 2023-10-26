using System.Data;
using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Utilities;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class StudentService
{
    private readonly SCA_ITSContext dbContext;
    private StudentReportService studentReportService;
    private MoodleService moodleService;
    private RegistrationService registrationService;
    private PrePrimaryProgressReportsService prePrimaryProgressReportsService;

    public StudentService(SCA_ITSContext dbContext, StudentReportService studentReportService, MoodleService moodleService, RegistrationService registrationService, PrePrimaryProgressReportsService prePrimaryProgressReportsService)
    {
        this.dbContext = dbContext;
        this.studentReportService = studentReportService;
        this.moodleService = moodleService;
        this.registrationService = registrationService;
        this.prePrimaryProgressReportsService = prePrimaryProgressReportsService;
    }

    #region GET

    /*----   GET ONE   ----*/
    public async Task<Response> GetOne(string studentNumber)
    {
        try
        {
            var student = await dbContext.Students.Where(s => s.StudentNumber == studentNumber).Select(s => new
            {
                s.ParentId,
                s.StudentNumber,
                s.FirstName,
                s.LastName,
                dob = s.Dob.ToString("dd/MM/yyyy"),
                s.Grade,

                s.Age,
                s.Gender,
                s.Citizenship,
                s.StudyPermit,
                s.HomeLanguage,
                s.PostalAddress,
                s.ResidentialAddress,
                s.TelephoneHome,
                s.TelephoneOther,
                s.CurrentChurch,
                s.CurrentChurchAddress,
                s.Pastor,
                s.PastorTelephone,
                fatherConfirmationDate = s.FatherConfirmationDate != null ? ((DateOnly)s.FatherConfirmationDate).ToString("dd/MM/yyyy") : "",
                motherConfirmationDate = s.MotherConfirmationDate != null ? ((DateOnly)s.MotherConfirmationDate).ToString("dd/MM/yyyy") : "",
                baptismDate = s.BaptismDate != null ? ((DateOnly)s.BaptismDate).ToString("dd/MM/yyyy") : "",
                s.CurrentGrade,
                s.LastSchoolAttended,
                s.NameOfPrincipal,
                s.SchoolAddress,
                s.StudentsStrengths,
                s.TalentsAndInterests,
                s.LearningDifficulties,
                s.DisiplinaryDifficulties,
                s.LegalDifficulties,
                s.AcademicLevel,
                s.AcademicFailureAssessment,
                s.FamilyDoctor,
                s.DoctorTelephone,
                s.OtherMedicalConditions,
                generalHearingTestDate = s.GeneralHearingTestDate != null ? ((DateOnly)s.GeneralHearingTestDate).ToString("dd/MM/yyyy") : "",
                generalVisionTestDate = s.GeneralVisionTestDate != null ? ((DateOnly)s.GeneralVisionTestDate).ToString("dd/MM/yyyy") : "",
                tuberculosisTestDate = s.TuberculosisTestDate != null ? ((DateOnly)s.TuberculosisTestDate).ToString("dd/MM/yyyy") : "",
                s.IsShy,
                s.BitesFingerNails,
                s.SucksThumb,
                s.HasExcessiveFears,
                s.LikesSchool,
                s.PlaysWellWithOthers,
                s.EatsBreakfastRegularly,
                s.Bedtime,
                s.RisingTime,
                s.DisabilityDueToDiseaseOrAccident,
                s.ChronicMedication,
                s.RegistrationStage
            }).FirstOrDefaultAsync();

            if (student is null)
                return new Response { errorMessage = "Student not found", data = 404 };

            return new Response { errorMessage = "", data = student };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    /*----   GET ALL   ----*/
    public async Task<Response> GetAll(StudentSearchParams searchParams)
    {
        try
        {
            var records = await (
                from s in dbContext.Students
                join p in dbContext.UserAccounts on s.ParentId equals p.UserId
                // where s.RegistrationStage == (int)STUDENT_REGISTRATION_STATUS.APPROVED
                where s.Grade == (searchParams.grade ?? s.Grade)
                && p.UserId == (searchParams.parentId ?? p.UserId)
                && s.RegistrationStage == (searchParams.registrationStage ?? s.RegistrationStage)
                select new
                StudentSingle
                {
                    ParentId = s.ParentId,
                    StudentNumber = s.StudentNumber,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    dob = s.Dob.ToString("dd/MM/yyyy"),
                    Grade = s.Grade,
                    RegistrationStage = s.RegistrationStage,
                    ParentEmail = p.Email,
                    CreatedAt = s.CreatedAt.ToString()
                }
            ).ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    /*----   GET ALL FOR PARENT   ----*/
    public async Task<Response> GetAllForParent(int parentId)
    {
        try
        {
            if (!(await dbContext.Parents.AnyAsync(p => p.UserId == parentId)))
            {
                return new Response { errorMessage = "Parent not found", data = 404 };
            }

            var records = await (
                from s in dbContext.Students
                where s.ParentId == parentId
                select new
                {
                    s.ParentId,
                    s.StudentNumber,
                    s.FirstName,
                    s.LastName,
                    dob = s.Dob.ToString("dd/MM/yyyy"),
                    s.Grade,
                    s.RegistrationStage,
                    CreatedAt = s.CreatedAt.ToString()
                }
            ).ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    /*----   GET ALL FOR STAFF   ----*/
    public async Task<Response> GetAllForStaff(int staffId)
    {
        try
        {
            if (!(await dbContext.UserAccounts.AnyAsync(u => u.UserId == staffId && u.UserTypeId == 3)))
            {
                return new Response { errorMessage = "Staff not found", data = 404 };
            }

            var records = await (
                from s in dbContext.Students
                join cs in dbContext.CourseStudents on s.StudentNumber equals cs.StudentNumber
                join cst in dbContext.CourseStaffs on cs.CourseId equals cst.CourseId
                where cst.StaffId == staffId
                select new
                {
                    s.ParentId,
                    s.StudentNumber,
                    s.FirstName,
                    s.LastName,
                    dob = s.Dob.ToString("dd/MM/yyyy"),
                    s.Grade
                }
            ).ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    #endregion

    /*----  EDIT   ----*/
    public async Task<Response> Edit(EditStudentRequest details, bool updateMoodle)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var student = await dbContext.Students.Where(s => s.StudentNumber == details.studentNumber).FirstOrDefaultAsync();
            if (student is null)
                return new Response { errorMessage = "Student not found", data = 404 };

            DateOnly tempDate;
            int gradeBeforeEdit = student.Grade;

            // edit student
            student.ParentId = details.parentId ?? student.ParentId;
            student.FirstName = details.firstName ?? student.FirstName;
            student.LastName = details.lastName ?? student.LastName;
            student.Dob = details.dob != null ? DateOnly.Parse(details.dob) : student.Dob;
            student.Grade = details.grade ?? student.Grade;
            student.Age = details.age ?? student.Age;
            student.Gender = details.gender ?? student.Gender;
            student.Citizenship = details.citizenship ?? student.Citizenship;
            student.StudyPermit = details.studyPermit ?? student.StudyPermit;
            student.HomeLanguage = details.homeLanguage ?? student.HomeLanguage;
            student.PostalAddress = details.postalAddress ?? student.PostalAddress;
            student.ResidentialAddress = details.residentialAddress ?? student.ResidentialAddress;
            student.TelephoneHome = details.telephoneHome ?? student.TelephoneHome;
            student.TelephoneOther = details.telephoneOther ?? student.TelephoneOther;
            student.CurrentChurch = details.currentChurch ?? student.CurrentChurch;
            student.CurrentChurchAddress = details.currentChurchAddress ?? student.CurrentChurchAddress;
            student.Pastor = details.pastor ?? student.Pastor;
            student.PastorTelephone = details.pastorTelephone ?? student.PastorTelephone;
            student.FatherConfirmationDate = (details.fatherConfirmationDate is not null && DateOnly.TryParse(details.fatherConfirmationDate, out tempDate)) ? DateOnly.Parse(details.fatherConfirmationDate) : (details.fatherConfirmationDate == "" ? null : student.FatherConfirmationDate);
            student.MotherConfirmationDate = (details.motherConfirmationDate is not null && DateOnly.TryParse(details.motherConfirmationDate, out tempDate)) ? DateOnly.Parse(details.motherConfirmationDate) : (details.motherConfirmationDate == "" ? null : student.MotherConfirmationDate);
            student.BaptismDate = (details.baptismDate is not null && DateOnly.TryParse(details.baptismDate, out tempDate)) ? DateOnly.Parse(details.baptismDate) : (details.baptismDate == "" ? null : student.BaptismDate);
            student.CurrentGrade = details.currentGrade ?? student.CurrentGrade;
            student.LastSchoolAttended = details.lastSchoolAttended ?? student.LastSchoolAttended;
            student.NameOfPrincipal = details.nameOfPrincipal ?? student.NameOfPrincipal;
            student.SchoolAddress = details.schoolAddress ?? student.SchoolAddress;
            student.StudentsStrengths = details.studentsStrengths ?? student.StudentsStrengths;
            student.TalentsAndInterests = details.talentsAndInterests ?? student.TalentsAndInterests;
            student.LearningDifficulties = details.learningDifficulties ?? student.LearningDifficulties;
            student.DisiplinaryDifficulties = details.disiplinaryDifficulties ?? student.DisiplinaryDifficulties;
            student.LegalDifficulties = details.legalDifficulties ?? student.LegalDifficulties;
            student.AcademicLevel = details.academicLevel ?? student.AcademicLevel;
            student.AcademicFailureAssessment = details.academicFailureAssessment ?? student.AcademicFailureAssessment;
            student.FamilyDoctor = details.familyDoctor ?? student.FamilyDoctor;
            student.DoctorTelephone = details.doctorTelephone ?? student.DoctorTelephone;
            student.OtherMedicalConditions = details.otherMedicalConditions ?? student.OtherMedicalConditions;
            student.GeneralHearingTestDate = (details.generalHearingTestDate is not null && DateOnly.TryParse(details.generalHearingTestDate, out tempDate)) ? DateOnly.Parse(details.generalHearingTestDate) : (details.generalHearingTestDate == "" ? null : student.GeneralHearingTestDate);
            student.GeneralVisionTestDate = (details.generalVisionTestDate is not null && DateOnly.TryParse(details.generalVisionTestDate, out tempDate)) ? DateOnly.Parse(details.generalVisionTestDate) : (details.generalVisionTestDate == "" ? null : student.GeneralVisionTestDate);
            student.TuberculosisTestDate = (details.tuberculosisTestDate is not null && DateOnly.TryParse(details.tuberculosisTestDate, out tempDate)) ? DateOnly.Parse(details.tuberculosisTestDate) : (details.tuberculosisTestDate == "" ? null : student.TuberculosisTestDate);
            student.IsShy = details.isShy ?? student.IsShy;
            student.BitesFingerNails = details.bitesFingerNails ?? student.BitesFingerNails;
            student.SucksThumb = details.sucksThumb ?? student.SucksThumb;
            student.HasExcessiveFears = details.hasExcessiveFears ?? student.HasExcessiveFears;
            student.LikesSchool = details.likesSchool ?? student.LikesSchool;
            student.PlaysWellWithOthers = details.playsWellWithOthers ?? student.PlaysWellWithOthers;
            student.EatsBreakfastRegularly = details.eatsBreakfastRegularly ?? student.EatsBreakfastRegularly;
            student.Bedtime = details.bedtime ?? student.Bedtime;
            student.RisingTime = details.risingTime ?? student.RisingTime;
            student.DisabilityDueToDiseaseOrAccident = details.disabilityDueToDiseaseOrAccident ?? student.DisabilityDueToDiseaseOrAccident;
            student.ChronicMedication = details.chronicMedication ?? student.ChronicMedication;

            student.RegistrationStage = details.registrationStage ?? student.RegistrationStage;

            dbContext.Students.Update(student);
            await dbContext.SaveChangesAsync();

            var parent = await dbContext.UserAccounts.FirstOrDefaultAsync(p => p.UserId == student.ParentId);
            if (parent is null)
                return new Response { errorMessage = "Parent not found", data = 404 };

            // if the grade changed and was or is 0, delete current report and create new one 
            if (gradeBeforeEdit != student.Grade && (gradeBeforeEdit == 0 || student.Grade == 0))
            {
                var result = await studentReportService.DeleteReportForLatestReportGroup(student.StudentNumber);
                if (result.errorMessage != "")
                    return result;

                result = (student.Grade > 0) ? await studentReportService.CreateReportForPrimaryStudentForLatestReportGroup(student) : await studentReportService.CreateReportForPrePrimaryStudentForLatestReportGroup(student);
                if (result.errorMessage != "")
                    return result;

                // create progress report records
                if (student.Grade == 0)
                {
                    result = await prePrimaryProgressReportsService.AddAllPrePrimaryProgressReportsForStudent(student.StudentNumber);
                    if (!string.IsNullOrEmpty(result.errorMessage))
                        return result;
                }
                else
                {
                    result = await prePrimaryProgressReportsService.DeleteAllStudentProgressReports(student.StudentNumber);
                    if (!string.IsNullOrEmpty(result.errorMessage))
                        return result;
                }
            }

            // edit moodle user if approved
            if (student.RegistrationStage == (int)STUDENT_REGISTRATION_STATUS.APPROVED && updateMoodle)
            {
                var result = await moodleService.EditUserByUsername(student.StudentNumber, new MoodleUpdateUserRequest
                {
                    userId = 0,
                    firstname = student.FirstName,
                    lastname = student.LastName,
                    email = parent.Email
                });
                if (result.errorMessage != "" && result.data != 404)
                    return new Response { errorMessage = "Failed to update moodle user: " + result.errorMessage, data = result.data };
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = 500 };
        }
    }

    /*----  BULK EDIT   ----*/
    public async Task<Response> BulkEdit(List<EditStudentRequest> detailsList, bool updateMoodle)
    {
        try
        {
            string studentsNotUpdated = "";
            foreach (var details in detailsList)
            {
                var result = await Edit(details, updateMoodle);
                if (result.errorMessage != "")
                    studentsNotUpdated += $"{details.studentNumber ?? ""},\t";
            }

            return new Response { errorMessage = studentsNotUpdated != "" ? $"These students failed to update: {studentsNotUpdated}" : "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = 500 };
        }
    }

    /*----  ADD   ----*/
    public async Task<Response> Add(AddStudentRequest details, bool isApproved)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "empty values", data = 400 };
            }

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // check if parent exists
            if (!(await dbContext.Parents.AnyAsync(p => p.UserId == details.parentId)))
            {
                return new Response { errorMessage = "Parent not found", data = 404 };
            }

            var studentNumber = await GenerateStudentNumber(details.dob, details.parentId);
            if (studentNumber == "")
            {
                return new Response { errorMessage = "Failed to generate student number", data = 500 };
            }

            // create new student
            var student = new Student()
            {
                ParentId = details.parentId,
                StudentNumber = studentNumber,
                FirstName = details.firstName,
                LastName = details.lastName,
                Grade = details.grade,
                Dob = DateOnly.Parse(details.dob),
                RegistrationStage = isApproved ? (int)STUDENT_REGISTRATION_STATUS.APPROVED : (int)STUDENT_REGISTRATION_STATUS.ADD_GENERAL_INFO
            };

            // store in db
            await dbContext.Students.AddAsync(student);
            await dbContext.SaveChangesAsync();

            // create registration status record
            var result = await registrationService.AddStudentRegistrationStatusRecord(studentNumber);
            if (result.errorMessage != "")
                return result;

            // if approved, create report for student 
            if (isApproved)
            {
                result = (student.Grade > 0) ? await studentReportService.CreateReportForPrimaryStudentForLatestReportGroup(student) : await studentReportService.CreateReportForPrePrimaryStudentForLatestReportGroup(student);

                // if an error occured delete student and throw exception
                if (result.errorMessage.Length > 0)
                    throw new Exception("Failed to create report record for student");

                // create progress report records
                if (student.Grade == 0)
                {
                    result = await prePrimaryProgressReportsService.AddAllPrePrimaryProgressReportsForStudent(studentNumber);
                    if (!string.IsNullOrEmpty(result.errorMessage))
                        throw new Exception("Failed to create progress reports: " + result.errorMessage);
                }

                // create moodle user for student
                var parent = await dbContext.UserAccounts.FirstAsync(p => p.UserId == student.ParentId);

                var addMoodleUserReq = new MoodleAddUserRequest()
                {
                    username = student.StudentNumber,
                    firstname = student.FirstName,
                    lastname = student.LastName,
                    email = parent.Email,
                    password = $"{student.StudentNumber}@Sca"
                };

                result = await moodleService.AddUser(addMoodleUserReq);

                if (result.errorMessage.Length > 0)
                    throw new Exception("Failed to create moodle user: " + result.errorMessage);

                //-------------------------------
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = ex.Message, data = 500 };
        }
    }

    /*----  ADD DIRECT WITH STUDENT NUMBER   ----*/
    public async Task<Response> AddDirectWithStudentNumber(AddStudentRequest details, string studentNumber)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "empty values", data = 400 };
            }

            // check if parent exists
            if (!(await dbContext.Parents.AnyAsync(p => p.UserId == details.parentId)))
            {
                return new Response { errorMessage = "Parent not found", data = 404 };
            }

            // check if student exists
            if ((await dbContext.Students.AnyAsync(s => s.StudentNumber == studentNumber)))
            {
                return new Response { errorMessage = "Student already exists", data = 409 };
            }


            // create new student
            var student = new Student()
            {
                ParentId = details.parentId,
                StudentNumber = studentNumber,
                FirstName = details.firstName,
                LastName = details.lastName,
                Grade = details.grade,
                Dob = DateOnly.Parse(details.dob),
                RegistrationStage = (int)STUDENT_REGISTRATION_STATUS.APPROVED
            };

            // store in db
            await dbContext.Students.AddAsync(student);
            await dbContext.SaveChangesAsync();

            var result = (student.Grade > 0) ? await studentReportService.CreateReportForPrimaryStudentForLatestReportGroup(student) : await studentReportService.CreateReportForPrePrimaryStudentForLatestReportGroup(student);

            // if an error occured delete student and throw exception
            if (result.errorMessage.Length > 0)
                throw new Exception("Failed to create report record for student");

            // create progress report records
            if (student.Grade == 0)
            {
                result = await prePrimaryProgressReportsService.AddAllPrePrimaryProgressReportsForStudent(studentNumber);
                if (!string.IsNullOrEmpty(result.errorMessage))
                    throw new Exception("Failed to create progress reports: " + result.errorMessage);
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = ex.Message, data = 500 };
        }
    }

    /*----   DELETE   ----*/
    public async Task<Response> Delete(string studentNumber, bool deleteFromMoodle)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var student = await dbContext.Students.Where(u => u.StudentNumber == studentNumber).FirstOrDefaultAsync();
            if (student is null)
            {
                return new Response { errorMessage = "Student not found", data = 404 };
            }

            dbContext.Students.Remove(student);
            await dbContext.SaveChangesAsync();

            // delete from moodle if approved. Unregistered students dont have accounts on moodle

            if (student.RegistrationStage == (int)STUDENT_REGISTRATION_STATUS.APPROVED && deleteFromMoodle)
            {
                var result = await moodleService.DeleteUserByUsername(studentNumber);

                if (result.errorMessage != "" && result.data != 404)
                {
                    return new Response { errorMessage = "Failed to delete moodle user: " + result.errorMessage, data = result.data };
                }
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }


    /// <summary>
    ///     Generates a unique student number based on the current year,
    ///     the students date of birth, the students parent id, and the 
    ///     current count of students in the database --- yy-yy-mm-dd-parentId-studentCount
    /// </summary>
    /// <param name="dob">Date of birth of the student</param>
    /// <param name="parentId">Parents user id</param>
    /// <returns>A string representation of the student number or an empty string if an error occurred</returns>
    private async Task<string> GenerateStudentNumber(string dob, int parentId)
    {
        try
        {
            DateOnly dateOfBirth = DateOnly.Parse(dob);
            int studentCount = await dbContext.Students.CountAsync();
            string currentYear = DateTime.Today.Year.ToString().Substring(2);
            string birthYear = dateOfBirth.Year.ToString().Substring(2);

            return $"{currentYear}{birthYear}{dateOfBirth.Month}{dateOfBirth.Day}{parentId}{studentCount}";
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.InnerException);
            return "";
        }
    }
}