namespace SCA_ITS_back_end.Models;

public class MoodleDeleteCourseRequest
{
    public int id { get; set; }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>
        {
            {"courseids[0]",this.id.ToString()},
        };
        return new FormUrlEncodedContent(data);
    }
}