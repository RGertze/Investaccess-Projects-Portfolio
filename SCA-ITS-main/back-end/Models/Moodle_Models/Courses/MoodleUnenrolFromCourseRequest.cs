namespace SCA_ITS_back_end.Models;

public class MoodleUnenrolFromCourseRequest
{
    public int userid { get; set; }
    public int courseid { get; set; }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>
        {
            {"enrolments[0][userid]",this.userid.ToString()},
            {"enrolments[0][courseid]",this.courseid.ToString()},
        };
        return new FormUrlEncodedContent(data);
    }
}