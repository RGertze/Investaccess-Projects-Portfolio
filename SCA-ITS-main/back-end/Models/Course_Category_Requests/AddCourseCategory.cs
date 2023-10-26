namespace SCA_ITS_back_end.Models;

public class AddCourseCategory : BaseRequest
{
    public int? parentCategoryId { get; set; }
    public string? name { get; set; }
    public string? description { get; set; }
}