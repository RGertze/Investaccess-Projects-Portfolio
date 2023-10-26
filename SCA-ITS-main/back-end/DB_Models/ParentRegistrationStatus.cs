using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class ParentRegistrationStatus
    {
        public int ParentId { get; set; }
        public ulong DetailsAdded { get; set; }
        public ulong OtherParentsAdded { get; set; }
        public ulong StudentsAdded { get; set; }
        public ulong RequiredDocsAdded { get; set; }
        public string? DetailsRejectionMessage { get; set; }
        public string? OtherParentsRejectionMessage { get; set; }
        public string? StudentsRejectionMessage { get; set; }
        public string? RequiredDocsRejectionMessage { get; set; }
        public ulong RegistrationFeePaid { get; set; }
        public string? RegistrationFeeRejectionMessage { get; set; }

        public virtual Parent Parent { get; set; } = null!;
    }
}
