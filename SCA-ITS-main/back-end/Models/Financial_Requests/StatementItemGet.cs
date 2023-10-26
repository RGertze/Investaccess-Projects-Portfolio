
namespace SCA_ITS_back_end.Models;

public class StatementItemGet
{

    public int? Id { get; set; }
    public string? date { get; set; }
    public string? Reference { get; set; }
    public string? Description { get; set; }
    public decimal? DebitAmount { get; set; }
    public decimal? CreditAmount { get; set; }

}