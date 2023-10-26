namespace SCA_ITS_back_end.Models;

public class EditFeeForGrade : BaseRequest
{
    public int? grade { get; set; }
    public decimal? amount { get; set; }
}