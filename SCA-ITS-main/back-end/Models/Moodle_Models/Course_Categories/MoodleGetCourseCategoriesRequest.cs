
namespace SCA_ITS_back_end.Models;

public class MoodleGetCourseCategoriesRequest
{
    public int? id { get; set; }
    public int? parent { get; set; }
    public string? name { get; set; }
    public virtual FormUrlEncodedContent getAsFormContent()
    {
        var data = new Dictionary<string, string>();

        if (this.id is not null)
        {
            data.Add("criteria[0][key]", "id");
            data.Add("criteria[0][value]", this.id.ToString());
        }
        if (this.id is not null)
        {
            data.Add("criteria[0][key]", "parent");
            data.Add("criteria[0][value]", this.parent.ToString());
        }
        if (this.name is not null)
        {
            data.Add("criteria[1][key]", "name");
            data.Add("criteria[1][value]", this.name);
        }

        return new FormUrlEncodedContent(data);
    }
}