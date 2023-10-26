using System.ComponentModel.DataAnnotations;

namespace SCA_ITS_back_end.Models;

public class UpdateStudentExamMark : BaseRequest
{
    public int? id { get; set; }
    public decimal? mark { get; set; }
}