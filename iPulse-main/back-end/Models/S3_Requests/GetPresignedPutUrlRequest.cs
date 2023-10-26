using System.ComponentModel.DataAnnotations;

namespace iPulse_back_end.Models;

public class GetPresignedPutUrlRequest : BaseRequest
{
    public string? filename { get; set; }
}