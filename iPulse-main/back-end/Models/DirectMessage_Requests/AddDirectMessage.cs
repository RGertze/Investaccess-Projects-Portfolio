namespace iPulse_back_end.Models;

public class AddDirectMessage : BaseRequest
{
    public int fromId { get; set; }
    public int toId { get; set; }
    public string? content { get; set; }
}