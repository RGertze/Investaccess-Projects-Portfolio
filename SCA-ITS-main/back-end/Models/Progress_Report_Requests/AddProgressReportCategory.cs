using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class AddProgressReportCategory : BaseRequest
{
    public int? progressReportId { get; set; }
    public string? name { get; set; }
    public decimal? weight { get; set; }
}