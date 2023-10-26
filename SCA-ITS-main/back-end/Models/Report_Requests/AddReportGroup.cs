namespace SCA_ITS_back_end.Models;

public class AddReportGroup : BaseRequest
{
    public short? year { get; set; }
    public int? terms { get; set; }
}