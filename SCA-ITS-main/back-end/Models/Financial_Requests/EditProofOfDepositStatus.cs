
namespace SCA_ITS_back_end.Models;

public class EditProofOfDepositStatus : BaseRequest
{
    public int? id { get; set; }
    public int? status { get; set; }
}