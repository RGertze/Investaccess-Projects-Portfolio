namespace back_end.Utilities;

public enum ROLES
{
    ADMIN = 1,
    USER = 2
}

public sealed class Policies
{
    public const string REQUIRE_ADMIN_ROLE = "RequireAdminRole";
    public const string REQUIRE_USER_ROLE = "RequireUserRole";
}