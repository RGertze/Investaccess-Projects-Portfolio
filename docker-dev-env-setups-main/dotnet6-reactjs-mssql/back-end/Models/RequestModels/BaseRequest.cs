using System.Reflection;

namespace back_end.Models;

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
        PropertyInfo[] propertyInfos = obj.GetType().GetProperties();

        foreach (PropertyInfo propertyInfo in propertyInfos)
        {
            Object? value = propertyInfo.GetValue(obj, null);

            if (value is null)
            {
                continue;
            }

            if (value is string)
            {
                propertyInfo.SetValue(obj, ((string)value).ToLower());
            }
        }
    }
}

