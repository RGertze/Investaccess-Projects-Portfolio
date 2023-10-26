namespace SCA_ITS_back_end.Models;

public class DeleteCourseCategory : BaseRequest
{
    public int? moodleId { get; set; }
    public int? newParentId { get; set; }
    public int? deleteRecursively { get; set; }
}