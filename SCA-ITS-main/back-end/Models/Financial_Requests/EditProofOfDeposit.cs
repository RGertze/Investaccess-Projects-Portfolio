
namespace SCA_ITS_back_end.Models;

public class EditProofOfDeposit : BaseRequest
{
    public int? id { get; set; }
    public decimal? amount { get; set; }
    public string? filePath { get; set; }
    public string? fileName { get; set; }
}