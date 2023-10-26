using Microsoft.IdentityModel.Tokens;

namespace SCA_ITS_back_end.Helpers;

public class HtmlBuilder
{
    public static string BaseUrl = "http://localhost:5008";

    public static string build(string filePath, List<Tuple<string, string>> args)
    {
        string path = Directory.GetCurrentDirectory() + filePath;

        Console.WriteLine(path);

        if (File.Exists(path))
        {
            string fileContent = File.ReadAllText(path);
            foreach (Tuple<string, string> t in args)
            {
                fileContent = fileContent.Replace(t.Item1, t.Item2);
            }

            return fileContent;
        }

        return "";
    }
}