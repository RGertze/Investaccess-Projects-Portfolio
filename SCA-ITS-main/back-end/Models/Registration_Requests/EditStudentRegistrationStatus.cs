namespace SCA_ITS_back_end.Models;

public class EditStudentRegistrationStatus : BaseRequest
{
    public string? studentNumber { get; set; }
    public ulong? basicDetailsAdded { get; set; }
    public ulong? generalInfoAdded { get; set; }
    public ulong? religiousInfoAdded { get; set; }
    public ulong? scholasticInfoAdded { get; set; }
    public ulong? medicalInfoAdded { get; set; }
    public ulong? medicalConditionsAdded { get; set; }
    public ulong? otherParentsAdded { get; set; }
    public ulong? nonScaStudentsAdded { get; set; }
    public ulong? requiredDocsAdded { get; set; }
    public ulong? occupationalTherapyNeeded { get; set; }
    public ulong? occupationalReportAdded { get; set; }
    public ulong? diagnosticTestNeeded { get; set; }
    public ulong? diagnosticResultAdded { get; set; }


    public string? therapistName { get; set; }
    public string? therapistCell { get; set; }
    public string? therapistEmail { get; set; }
    public string? therapistUrl { get; set; }


    public string? diagnosticTestLink { get; set; }


    public string? basicRejectionMessage { get; set; }
    public string? generalRejectionMessage { get; set; }
    public string? religiousRejectionMessage { get; set; }
    public string? scholasticRejectionMessage { get; set; }
    public string? medicalRejectionMessage { get; set; }
    public string? conditionsRejectionMessage { get; set; }
    public string? otherParentsRejectionMessage { get; set; }
    public string? nonScaRejectionMessage { get; set; }
    public string? requiredDocsRejectionMessage { get; set; }
    public string? therapyRejectionMessage { get; set; }
    public string? diagnosticRejectionMessage { get; set; }

}