namespace SCA_ITS_back_end.Models;

public class AddGenerationJob : BaseRequest
{
    public int? reportGroupId { get; set; }
    public int? term { get; set; }
    public string? schoolReOpens { get; set; }
}