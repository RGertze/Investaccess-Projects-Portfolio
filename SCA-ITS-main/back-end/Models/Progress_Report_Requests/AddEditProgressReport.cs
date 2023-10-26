using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class AddProgressReport : BaseRequest
{
    public string? name { get; set; }
    public decimal? examMarksAvailable { get; set; }
    public decimal? examWeight { get; set; }
}