using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class EditStudentRequest : BaseRequest
{
    public string? studentNumber { get; set; }
    public int? parentId { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public string? dob { get; set; }
    public int? grade { get; set; }

    public int? age { get; set; }
    public int? gender { get; set; }
    public string? citizenship { get; set; }
    public string? studyPermit { get; set; }
    public string? homeLanguage { get; set; }
    public string? postalAddress { get; set; }
    public string? residentialAddress { get; set; }
    public string? telephoneHome { get; set; }
    public string? telephoneOther { get; set; }
    public string? currentChurch { get; set; }
    public string? currentChurchAddress { get; set; }
    public string? pastor { get; set; }
    public string? pastorTelephone { get; set; }
    public string? fatherConfirmationDate { get; set; }
    public string? motherConfirmationDate { get; set; }
    public string? baptismDate { get; set; }
    public int? currentGrade { get; set; }
    public string? lastSchoolAttended { get; set; }
    public string? nameOfPrincipal { get; set; }
    public string? schoolAddress { get; set; }
    public string? studentsStrengths { get; set; }
    public string? talentsAndInterests { get; set; }
    public string? learningDifficulties { get; set; }
    public string? disiplinaryDifficulties { get; set; }
    public string? legalDifficulties { get; set; }
    public string? academicLevel { get; set; }
    public string? academicFailureAssessment { get; set; }
    public string? familyDoctor { get; set; }
    public string? doctorTelephone { get; set; }
    public string? otherMedicalConditions { get; set; }
    public string? generalHearingTestDate { get; set; }
    public string? generalVisionTestDate { get; set; }
    public string? tuberculosisTestDate { get; set; }
    public ulong? isShy { get; set; }
    public ulong? bitesFingerNails { get; set; }
    public ulong? sucksThumb { get; set; }
    public ulong? hasExcessiveFears { get; set; }
    public ulong? likesSchool { get; set; }
    public ulong? playsWellWithOthers { get; set; }
    public ulong? eatsBreakfastRegularly { get; set; }
    public string? bedtime { get; set; }
    public string? risingTime { get; set; }
    public string? disabilityDueToDiseaseOrAccident { get; set; }
    public string? chronicMedication { get; set; }

    public int? registrationStage { get; set; }
}