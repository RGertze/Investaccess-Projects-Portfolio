namespace SCA_ITS_back_end.Models;

public class MoodleAddCourseCategory
{
    public string name { get; set; }
    public string description { get; set; }
    public int? parentId { get; set; }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>
        {
            {"categories[0][name]",this.name},
            {"categories[0][description]",this.description},
            {"categories[0][parent]",(this.parentId??0).ToString()},
        };
        return new FormUrlEncodedContent(data);
    }
}