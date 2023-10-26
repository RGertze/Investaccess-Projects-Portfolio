namespace SCA_ITS_back_end.Models;

public class AddNonScaSibling : BaseRequest
{
    public string? studentNumber { get; set; }
    public string? name { get; set; }
    public int? age { get; set; }
}