
namespace SCA_ITS_back_end.Models;

public class MoodleGetUsersRequest
{
    public int? id { get; set; }
    public string? username { get; set; }
    public string? email { get; set; }
    public string? firstname { get; set; }
    public string? lastname { get; set; }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>();

        if (this.id is not null)
        {
            data.Add("criteria[0][key]", "id");
            data.Add("criteria[0][value]", this.id.ToString());
        }
        if (this.username is not null)
        {
            data.Add("criteria[1][key]", "username");
            data.Add("criteria[1][value]", this.username);
        }
        if (this.email is not null)
        {
            data.Add("criteria[2][key]", "email");
            data.Add("criteria[2][value]", this.email);
        }
        if (this.firstname is not null)
        {
            data.Add("criteria[3][key]", "firstname");
            data.Add("criteria[3][value]", this.firstname);
        }
        if (this.lastname is not null)
        {
            data.Add("criteria[4][key]", "lastname");
            data.Add("criteria[4][value]", this.lastname);
        }

        return new FormUrlEncodedContent(data);
    }
}