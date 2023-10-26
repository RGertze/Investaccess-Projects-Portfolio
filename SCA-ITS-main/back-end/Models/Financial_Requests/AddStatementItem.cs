
namespace SCA_ITS_back_end.Models;

public class AddStatementItem : BaseRequest
{
    public int? parentId { get; set; }
    public int? itemType { get; set; }
    public decimal? debitAmount { get; set; }
    public decimal? creditAmount { get; set; }
    public string? description { get; set; }
}