using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class GetPresignedGetUrlRequest : BaseRequest
{
    public string? filePath { get; set; }
}