namespace SCA_ITS_back_end.Models;

public class EditNonScaSibling : BaseRequest
{
    public int? id { get; set; }
    public string? name { get; set; }
    public int? age { get; set; }
}