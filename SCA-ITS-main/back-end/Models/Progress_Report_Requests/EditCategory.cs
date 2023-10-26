namespace SCA_ITS_back_end.Models;

public class EditCategory : BaseRequest
{
    public int? id { get; set; }
    public string? name { get; set; }
    public decimal? weight { get; set; }
}