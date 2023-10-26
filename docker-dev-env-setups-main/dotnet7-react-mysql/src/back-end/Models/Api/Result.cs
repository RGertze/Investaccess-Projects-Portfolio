namespace back_end.Models;

public class Result
{
    public int statusCode { get; set; }
    public dynamic data { get; set; }
    public String message { get; set; }
}