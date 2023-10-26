namespace back_end.Models;

public class AddItemRequest : BaseRequest
{
    public string itemName { get; set; } = null!;

    public string itemDescription { get; set; } = null!;
    public int categoryId { get; set; }
}