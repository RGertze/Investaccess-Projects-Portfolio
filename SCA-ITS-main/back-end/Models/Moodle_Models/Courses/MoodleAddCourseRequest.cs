namespace SCA_ITS_back_end.Models;

public class MoodleAddCourseRequest
{
    public string fullname { get; set; }
    public string shortname { get; set; }
    public int categoryid { get; set; }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>
        {
            {"courses[0][fullname]",this.fullname},
            {"courses[0][shortname]",this.shortname},
            {"courses[0][categoryid]",this.categoryid.ToString()},
        };
        return new FormUrlEncodedContent(data);
    }
}