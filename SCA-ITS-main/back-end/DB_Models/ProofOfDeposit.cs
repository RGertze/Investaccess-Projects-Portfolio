using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class ProofOfDeposit
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public string FilePath { get; set; } = null!;
        public string FileName { get; set; } = null!;
        public decimal Amount { get; set; }
        public int Status { get; set; }
        public string? RejectionMessage { get; set; }

        public virtual ParentFinancialStatement Parent { get; set; } = null!;
    }
}
