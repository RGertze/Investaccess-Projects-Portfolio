namespace SCA_ITS_back_end.Models;

public class MoodleAddUsersRequest
{
    private List<MoodleAddUserRequest> users;

    public MoodleAddUsersRequest(List<MoodleAddUserRequest> list)
    {
        this.users = list;
    }

    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>();

        for (int i = 0; i < users.Count; i++)
        {
            var user = users[i];
            data.Add($"users[{i}][username]", user.username);
            data.Add($"users[{i}][password]", user.password);
            data.Add($"users[{i}][firstname]", user.firstname);
            data.Add($"users[{i}][lastname]", user.lastname);
            data.Add($"users[{i}][email]", user.email);
        }

        return new FormUrlEncodedContent(data);
    }
}