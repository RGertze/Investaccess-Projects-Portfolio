namespace SCA_ITS_back_end.Models;

public class MoodleAddUserRequest
{
    public string username { get; set; }
    public string password { get; set; }
    public string firstname { get; set; }
    public string lastname { get; set; }
    public string email { get; set; }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>
        {
            {"users[0][username]",this.username},
            {"users[0][password]",this.password},
            {"users[0][firstname]",this.firstname},
            {"users[0][lastname]",this.lastname},
            {"users[0][email]",this.email},
        };
        return new FormUrlEncodedContent(data);
    }
}