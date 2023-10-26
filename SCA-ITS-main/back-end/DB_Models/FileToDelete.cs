using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.DB_Models
{
    public partial class FileToDelete
    {
        public string FilePath { get; set; } = null!;
        public string FileName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
