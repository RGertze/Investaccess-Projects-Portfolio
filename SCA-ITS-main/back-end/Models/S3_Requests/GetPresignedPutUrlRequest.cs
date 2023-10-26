using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class GetPresignedPutUrlRequest : BaseRequest
{
    public string? filename { get; set; }
}