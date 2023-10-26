namespace SCA_ITS_back_end.Models;

public class MoodleGetEnrollementsRequest
{
    public int courseid { get; set; }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>
        { };
        return new FormUrlEncodedContent(data);
    }

    public string addQueryParams(string baseUrl)
    {
        return $"{baseUrl}&courseid={courseid}";
    }
}