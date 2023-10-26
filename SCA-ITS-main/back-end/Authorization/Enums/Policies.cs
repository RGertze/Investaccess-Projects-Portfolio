namespace SCA_ITS_back_end.Authorization.Enums;

public sealed class Policies
{
    public const string REQUIRE_ADMIN_ROLE = "RequireAdminRole";
    public const string REQUIRE_PARENT_ROLE = "RequireParentRole";
    public const string REQUIRE_STAFF_ROLE = "RequireStaffRole";
    public const string REQUIRE_STAFF_OR_PARENT_ROLE = "RequireStaffOrParentRole";
    public const string REQUIRE_ADMIN_OR_PARENT_ROLE = "RequireAdminOrParentRole";
    public const string REQUIRE_ADMIN_OR_STAFF_ROLE = "RequireAdminOrStaffRole";
    public const string REQUIRE_ANY_ROLE = "RequireAnyRole";
}