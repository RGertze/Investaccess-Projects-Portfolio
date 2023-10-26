
namespace SCA_ITS_back_end.Models;

public class MoodleGetCourseRequests
{
    public int? id { get; set; }
    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>();

        if (this.id is not null)
        {
            data.Add("options[ids][0]", this.id.ToString());
        }

        return new FormUrlEncodedContent(data);
    }
}