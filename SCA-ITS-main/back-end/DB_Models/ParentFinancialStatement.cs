using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class ParentFinancialStatement
    {
        public ParentFinancialStatement()
        {
            ProofOfDeposits = new HashSet<ProofOfDeposit>();
            StatementItems = new HashSet<StatementItem>();
        }

        public int ParentId { get; set; }
        public decimal CurrentBalance { get; set; }

        public virtual UserAccount Parent { get; set; } = null!;
        public virtual ICollection<ProofOfDeposit> ProofOfDeposits { get; set; }
        public virtual ICollection<StatementItem> StatementItems { get; set; }
    }
}
