namespace back_end.Models;

public class TodoRequest
{
    public int? id { get; set; }
    public int userId { get; set; }
    public String name { get; set; }
    public String description { get; set; }
}