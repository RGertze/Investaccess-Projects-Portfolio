using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class AddEditCourseRequest : BaseRequest
{
    public string? courseId { get; set; }
    public int? categoryId { get; set; }
    public string? name { get; set; }
    public int? grade { get; set; }
    public int? typeId { get; set; }
    public int? isPromotional { get; set; }
}