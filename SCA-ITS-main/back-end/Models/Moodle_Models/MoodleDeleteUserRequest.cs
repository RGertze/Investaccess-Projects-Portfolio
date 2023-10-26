namespace SCA_ITS_back_end.Models;

public class MoodleDeleteUserRequest
{
    public int userId { get; set; }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>
        {
            {"userids[0]",this.userId.ToString()},
        };
        return new FormUrlEncodedContent(data);
    }
}