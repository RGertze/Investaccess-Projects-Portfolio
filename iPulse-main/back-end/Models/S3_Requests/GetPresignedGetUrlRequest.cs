using System.ComponentModel.DataAnnotations;

namespace iPulse_back_end.Models;

public class GetPresignedGetUrlRequest : BaseRequest
{
    public string? filePath { get; set; }
}