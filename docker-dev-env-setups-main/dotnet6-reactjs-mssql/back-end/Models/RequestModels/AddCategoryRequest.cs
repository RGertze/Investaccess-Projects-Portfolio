namespace back_end.Models;

public class AddCategoryRequest : BaseRequest
{
    public string categoryName { get; set; } = null!;

    public string categoryDescription { get; set; } = null!;
}