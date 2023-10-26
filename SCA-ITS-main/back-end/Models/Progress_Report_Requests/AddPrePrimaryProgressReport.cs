using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class AddPrePrimaryProgressReport : BaseRequest
{
    public int? year { get; set; }
    public int? terms { get; set; }
}