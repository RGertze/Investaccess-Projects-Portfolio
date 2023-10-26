using SCA_ITS_back_end.DB_Models;

namespace SCA_ITS_back_end.Models;

public class FinancialStatement
{
    public string date { get; set; }
    public string firstName { get; set; }
    public string lastName { get; set; }
    public string address { get; set; }

    public decimal CurrentBalance { get; set; }

    public List<StatementItem> statementItems { get; set; }
}