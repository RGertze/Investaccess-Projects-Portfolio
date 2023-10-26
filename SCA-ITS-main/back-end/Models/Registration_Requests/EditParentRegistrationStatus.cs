
namespace SCA_ITS_back_end.Models;

public class EditParentRegistrationStatus : BaseRequest
{
    public int? parentId { get; set; }

    public ulong? detailsAdded { get; set; }
    public ulong? studentsAdded { get; set; }
    public ulong? otherParentsAdded { get; set; }
    public ulong? requiredDocsAdded { get; set; }

    public string? detailsRejectionMessage { get; set; }
    public string? otherParentsRejectionMessage { get; set; }
    public string? studentsRejectionMessage { get; set; }
    public string? requiredDocsRejectionMessage { get; set; }

    public ulong? registrationFeePaid { get; set; }
    public string? registrationFeeRejectionMessage { get; set; }
}