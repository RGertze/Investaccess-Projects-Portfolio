using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class ParentRegistrationPaymentFile
    {
        public string FilePath { get; set; } = null!;
        public string FileName { get; set; } = null!;
        public int ParentId { get; set; }

        public virtual Parent Parent { get; set; } = null!;
    }
}
