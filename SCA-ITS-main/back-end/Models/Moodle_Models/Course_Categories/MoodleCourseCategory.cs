namespace SCA_ITS_back_end.Models;

public class MoodleCourseCategory
{
    public int id { get; set; }
    public int? parent { get; set; }
    public string name { get; set; }
    public string? description { get; set; }
}