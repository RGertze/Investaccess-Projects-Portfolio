namespace SCA_ITS_back_end.Models;

public class MoodleUpdateCourseCategoryRequest
{
    public int id { get; set; }
    public string name { get; set; }
    public string description { get; set; }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>
        {
            {"categories[0][id]",this.id.ToString()},
            {"categories[0][name]",this.name},
            {"categories[0][description]",this.description},
        };
        return new FormUrlEncodedContent(data);
    }
}