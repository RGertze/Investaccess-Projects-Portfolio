using System;
using System.Collections.Generic;

namespace SCA_ITS_back_end.Models;

public class AddStudentRegistrationFileRequest : BaseRequest
{
    public string filePath { get; set; } = null!;
    public int requiredId { get; set; }
    public string studentNumber { get; set; } = null!;
    public string? name { get; set; }
}

