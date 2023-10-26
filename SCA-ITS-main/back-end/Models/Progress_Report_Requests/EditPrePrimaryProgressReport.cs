using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class EditPrePrimaryProgressReport : BaseRequest
{
    public int id { get; set; }
    public int? year { get; set; }
    public int? terms { get; set; }
}