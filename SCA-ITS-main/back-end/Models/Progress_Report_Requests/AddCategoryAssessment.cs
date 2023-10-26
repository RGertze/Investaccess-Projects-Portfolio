using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class AddCategoryAssessment : BaseRequest
{
    public int? categoryId { get; set; }
    public string? name { get; set; }
    public decimal? marksAvailable { get; set; }
}