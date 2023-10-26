using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.Models;

public class AddParentRegistrationFileRequest : BaseRequest
{
    public string filePath { get; set; } = null!;
    public int requiredId { get; set; }
    public int userId { get; set; }
    public string? name { get; set; }
}
