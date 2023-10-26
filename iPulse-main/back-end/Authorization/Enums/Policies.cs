namespace iPulse_back_end.Authorization.Enums;

public sealed class Policies
{
    public const string REQUIRE_ADMIN_ROLE = "RequireAdminRole";
    public const string REQUIRE_DOCTOR_ROLE = "RequireDoctorRole";
    public const string REQUIRE_PATIENT_ROLE = "RequirePatientRole";
    public const string REQUIRE_RECEPTIONIST_ROLE = "RequireReceptionistRole";
    public const string REQUIRE_DOCTOR_OR_PATIENT_ROLE = "RequireDoctorOrReceptionistRole";
    public const string REQUIRE_DOCTOR_OR_PATIENT_OR_RECEPTIONIST_ROLE = "RequireDoctorOrPatientOrReceptionistRole";
    public const string REQUIRE_DOCTOR_OR_RECEPTIONIST_ROLE = "RequireDoctorOrPatientRole";
    public const string REQUIRE_ANY_ROLE = "RequireAnyRole";
}