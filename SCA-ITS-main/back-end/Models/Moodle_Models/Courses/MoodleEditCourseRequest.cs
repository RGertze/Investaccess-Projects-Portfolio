namespace SCA_ITS_back_end.Models;

public class MoodleEditCourseRequest
{
    public int id { get; set; }
    public int? categoryid { get; set; }
    public string? name { get; set; }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string> { { "courses[0][id]", this.id.ToString() } };

        if (this.categoryid is not null)
            data.Add("courses[0][categoryid]", this.categoryid.ToString());

        if (this.name is not null)
            data.Add("courses[0][fullname]", this.name);

        return new FormUrlEncodedContent(data);
    }
}