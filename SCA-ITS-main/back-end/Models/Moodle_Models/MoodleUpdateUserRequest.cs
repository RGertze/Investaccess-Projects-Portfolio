
namespace SCA_ITS_back_end.Models;

public class MoodleUpdateUserRequest
{
    public int userId { get; set; }
    public string? username { get; set; }
    public string? firstname { get; set; }
    public string? lastname { get; set; }
    public string? email { get; set; }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string> { { "users[0][id]", this.userId.ToString() } };

        if (this.username is not null)
            data.Add("users[0][username]", this.username);

        if (this.firstname is not null)
            data.Add("users[0][firstname]", this.firstname);

        if (this.lastname is not null)
            data.Add("users[0][lastname]", this.lastname);

        if (this.email is not null)
            data.Add("users[0][email]", this.email);

        return new FormUrlEncodedContent(data);
    }
}