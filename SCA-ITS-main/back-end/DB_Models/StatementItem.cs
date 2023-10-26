using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class StatementItem
    {
        public int Id { get; set; }
        public int StatementId { get; set; }
        public decimal DebitAmount { get; set; }
        public decimal CreditAmount { get; set; }
        public DateOnly Date { get; set; }
        public string Reference { get; set; } = null!;
        public string Description { get; set; } = null!;

        public virtual ParentFinancialStatement Statement { get; set; } = null!;
    }
}
