using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.Models;

public class AddParentRegistrationFeeFile : BaseRequest
{
    public int? parentId { get; set; }
    public string? filePath { get; set; } = null!;
    public string? fileName { get; set; }
}

