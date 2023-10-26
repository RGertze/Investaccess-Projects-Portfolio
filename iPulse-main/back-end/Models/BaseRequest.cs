using System.Reflection;

namespace iPulse_back_end.Models;

public class BaseRequest
{
    public static bool IsNullOrEmpty(BaseRequest obj)
    {
        PropertyInfo[] propertyInfos = obj.GetType().GetProperties();

        foreach (PropertyInfo propertyInfo in propertyInfos)
        {
            Object? value = propertyInfo.GetValue(obj, null);

            string valueStr = (value is null) ? "" : value.ToString();

            if (string.IsNullOrEmpty(valueStr))
            {
                return true;
            }

        }

        return false;
    }

    //----   CONVERT ALL STRINGS IN OBJECT TO LOWERCASE   ----
    public static void toLowerAllStrings(BaseRequest obj)
    {
        // get properties of object
        PropertyInfo[] propertyInfos = obj.GetType().GetProperties();

        foreach (PropertyInfo propertyInfo in propertyInfos)
        {
            // get value
            Object? value = propertyInfo.GetValue(obj, null);

            // do nothing if value is null
            if (value is null)
            {
                continue;
            }

            // if value is a string, convert to lowercase
            if (value is string)
            {
                propertyInfo.SetValue(obj, ((string)value).ToLower());
            }
        }
    }
}
