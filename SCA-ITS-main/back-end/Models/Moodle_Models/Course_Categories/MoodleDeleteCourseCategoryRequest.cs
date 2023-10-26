namespace SCA_ITS_back_end.Models;

public class MoodleDeleteCourseCategoryRequest
{
    public int id { get; set; }
    public int newParentId { get; set; }
    public int recursiveDelete { get; set; }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>
        {
            {"categories[0][id]",this.id.ToString()},
            {"categories[0][recursive]",this.recursiveDelete.ToString()},
        };
        return new FormUrlEncodedContent(data);
    }
}