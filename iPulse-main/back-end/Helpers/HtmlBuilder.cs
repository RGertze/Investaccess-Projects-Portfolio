using Microsoft.IdentityModel.Tokens;

namespace iPulse_back_end.Helpers;

public class HtmlBuilder
{
    public static string BaseUrl = "http://localhost:5008";

    private static string replaceTuples(string filePath, List<Tuple<string, string>> args)
    {
        if (File.Exists(filePath))
        {
            string fileContent = File.ReadAllText(filePath);
            foreach (Tuple<string, string> t in args)
            {
                fileContent = fileContent.Replace(t.Item1, t.Item2);
            }

            return fileContent;
        }

        return "";
    }

    public static string build(string filePath, List<Tuple<string, string>> args)
    {
        string path = Directory.GetCurrentDirectory() + filePath;

        return replaceTuples(path, args);
    }

    public static string buildErrorMessage(string errorMessage)
    {

        string path = Directory.GetCurrentDirectory() + "/Html_Templates/errorMessage.html";

        var replacements = new List<Tuple<string, string>>(){
            new("{homeLink}", BaseUrl),
            new("{errorMessage}", errorMessage),
        };

        return replaceTuples(path, replacements);
    }
}