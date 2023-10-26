using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class FeesForGrade
    {
        public int Grade { get; set; }
        public decimal Amount { get; set; }
    }
}
