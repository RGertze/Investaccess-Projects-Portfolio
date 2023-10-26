
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using Pulse_back_end.Models;
using iPulse_back_end.Models;
using Microsoft.Extensions.Configuration;
using iPulse_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_1")]
public class DoctorTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;

    public DoctorTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
    {
        client = factory.CreateDefaultClient();
        client.Timeout = TimeSpan.FromSeconds(600);
        _testOutputHelper = testOutputHelper;

        IConfigurationBuilder builder = new ConfigurationBuilder();
        builder.AddJsonFile("appsettings.Development.json", false, true);
        config = builder.Build();

        JwtHandler jwtHandler = new JwtHandler(config);
        adminToken = jwtHandler.generate(9, 1);
        doctorToken = jwtHandler.generate(2, 2);
        patientToken = jwtHandler.generate(4, 3);
        invalidToken = jwtHandler.generate(10000000, 1);
    }



    //----   GET ALL DOCTOR SPECIALTIES, VALID   ----
    [Fact]
    public async Task GetAllDoctorSpecialtiesValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/doctor/specialties");

        Assert.True(response.IsSuccessStatusCode);
    }

    #region Doctor Profile tests

    //----   GET DOCTOR PROFILE, VALID   ----
    [Fact]
    public async Task GetDoctorProfileValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/doctor/profile/2");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET DOCTOR PROFILE INVALID, PROFILE NOT FOUND   ----
    [Fact]
    public async Task GetDoctorProfileInvalid_ProfileNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/doctor/profile/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   UPDATE DOCTOR PROFILE, VALID   ----
    [Fact]
    public async Task Post_UpdateDoctorProfileValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new DoctorProfileUpdateRequest()
        {
            UserId = 2,
            SpecialtyId = 2,
            Nationality = "Namibian",
            PracticeNumber = "2002",
            PracticeName = "Legitimate Doctor Inc",
            PracticeAddress = "addr",
            PracticeCity = "city",
            PracticeCountry = null,
            PracticeWebAddress = null,
            BusinessHours = null,
            AppointmentPrice = null,
            SecondaryCellphone = null,
            SecondaryEmail = null
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/profile/update", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE DOCTOR PROFILE INVALID, PROFILE NOT FOUND   ----
    [Fact]
    public async Task Post_UpdateDoctorProfileInvalid_ProfileNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new DoctorProfileUpdateRequest()
        {
            UserId = 1,
            SpecialtyId = 2,
            Nationality = "Namibian",
            PracticeNumber = "2002",
            PracticeName = "Legitimate Doctor Inc",
            PracticeAddress = "addr",
            PracticeCity = "city",
            PracticeCountry = null,
            PracticeWebAddress = null,
            BusinessHours = null,
            AppointmentPrice = null,
            SecondaryCellphone = null,
            SecondaryEmail = null
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/profile/update", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   UPDATE DOCTOR PROFILE INVALID, NOT A DOCTOR TOKEN   ----
    [Fact]
    public async Task Post_UpdateDoctorProfileInvalid_NotADoctorToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new DoctorProfileUpdateRequest()
        {
            UserId = 1,
            SpecialtyId = 2,
            Nationality = "Namibian",
            PracticeNumber = "2002",
            PracticeName = "Legitimate Doctor Inc",
            PracticeAddress = "addr",
            PracticeCity = "city",
            PracticeCountry = null,
            PracticeWebAddress = null,
            BusinessHours = null,
            AppointmentPrice = null,
            SecondaryCellphone = null,
            SecondaryEmail = null
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/profile/update", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion

    #region Doctor work history tests

    //----   ADD DOCTOR WORK HISTORY, VALID   ----
    [Fact]
    public async Task Post_AddDoctorWorkHistoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorWorkHistoryRequest()
        {
            doctorId = 2,
            companyName = "A company",
            startDate = "01/01/2001",
            endDate = "01/01/2002",
            role = "Custodian",
            duties = "Keep company premises clean. Perform routine maintenance tasks."
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/work-history", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD DOCTOR WORK HISTORY INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task Post_AddDoctorWorkHistoryInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorWorkHistoryRequest()
        {
            doctorId = 1,
            companyName = "A company",
            startDate = "01/01/2001",
            endDate = "01/01/2002",
            role = "Custodian",
            duties = "Keep company premises clean. Perform routine maintenance tasks."
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/work-history", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD DOCTOR WORK HISTORY INVALID, NOT A DOCTOR TOKEN   ----
    [Fact]
    public async Task Post_AddDoctorWorkHistoryInvalid_NotADoctorToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorWorkHistoryRequest()
        {
            doctorId = 1,
            companyName = "A company",
            startDate = "01/01/2001",
            endDate = "01/01/2002",
            role = "Custodian",
            duties = "Keep company premises clean. Perform routine maintenance tasks."
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/work-history", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   ADD DOCTOR WORK HISTORY INVALID, BAD REQUEST, EMPTY VALUES   ----
    [Fact]
    public async Task Post_AddDoctorWorkHistoryInvalid_BadRequest_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorWorkHistoryRequest()
        {
            doctorId = 2,
            companyName = "",
            startDate = "",
            endDate = "01/01/2002",
            role = "Custodian",
            duties = "Keep company premises clean. Perform routine maintenance tasks."
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/work-history", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD DOCTOR WORK HISTORY INVALID, BAD REQUEST, INVALID DATES   ----
    [Fact]
    public async Task Post_AddDoctorWorkHistoryInvalid_BadRequest_InvalidDates()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorWorkHistoryRequest()
        {
            doctorId = 2,
            companyName = "A company",
            startDate = "0101x2001",
            endDate = "0101x2002",
            role = "Custodian",
            duties = "Keep company premises clean. Perform routine maintenance tasks."
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/work-history", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   GET ALL A DOCTOR'S WORK HISTORY VALID   ----
    [Fact]
    public async Task GetAllDoctorWorkHistoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/doctor/work-history/2");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE DOCTOR WORK HISTORY VALID   ----
    [Fact]
    public async Task Post_DeleteDoctorWorkHistoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.DeleteAsync("api/doctor/work-history/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE DOCTOR WORK HISTORY INVALID, NOT FOUND   ----
    [Fact]
    public async Task Post_DeleteDoctorWorkHistoryInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.DeleteAsync("api/doctor/work-history/1000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   DELETE DOCTOR WORK HISTORY INVALID, NOT A DOCTOR TOKEN   ----
    [Fact]
    public async Task Post_DeleteDoctorWorkHistoryInvalid_NotADoctorToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/doctor/work-history/1000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion


    //----   GET ALL A DOCTOR'S PATIENTS, VALID   ----
    [Fact]
    public async Task GetAllADoctorsPatientsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/doctor/patients?doctorId=7");

        Assert.True(response.IsSuccessStatusCode);
    }

    #region Doctor education tests
    //----   GET DOCTOR EDUCATION VALID   ----
    [Fact]
    public async Task GetDoctorEducationValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/doctor/education/2");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD DOCTOR EDUCATION VALID   ----
    [Fact]
    public async Task Post_AddDoctorEducationValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorEducation()
        {
            doctorId = 2,
            instituteName = "some institute",
            qualificationName = "bachelors of cleaning"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/education", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD DOCTOR EDUCATION INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task Post_AddDoctorEducationInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorEducation()
        {
            doctorId = 1,
            instituteName = "some institute",
            qualificationName = "bachelors of cleaning"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/education", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD DOCTOR EDUCATION INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_AddDoctorEducationInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorEducation()
        {
            doctorId = 2,
            instituteName = "",
            qualificationName = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/education", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD DOCTOR EDUCATION INVALID, NOT A DOCTOR TOKEN   ----
    [Fact]
    public async Task Post_AddDoctorEducationInvalid_NotADoctorToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorEducation()
        {
            doctorId = 2,
            instituteName = "another institute",
            qualificationName = "masters of gardening"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/education", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   DELETE DOCTOR EDUCATION VALID   ----
    [Fact]
    public async Task DeleteDoctorEducationValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.DeleteAsync("api/doctor/education/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE DOCTOR EDUCATION INVALID, RECORD NOT FOUND   ----
    [Fact]
    public async Task DeleteDoctorEducationInvalid_RecordNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.DeleteAsync("api/doctor/education/1000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   DELETE DOCTOR EDUCATION INVALID, NOT A DOCTOR TOKEN   ----
    [Fact]
    public async Task DeleteDoctorEducationInvalid_NotADoctorToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/doctor/education/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion

    #region Doctor review tests

    //----   ADD DOCTOR REVIEW VALID   ----
    [Fact]
    public async Task Post_AddDoctorReviewValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorReviewRequest()
        {
            doctorId = 2,
            patientId = 4,
            comment = "Worst doctor ive ever seen. Arrogent, unhelpful, and just plain rude! Good looking though, 5/5 would visit again.",
            rating = 5
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/review", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD DOCTOR REVIEW INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task Post_AddDoctorReviewInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorReviewRequest()
        {
            doctorId = 1,
            patientId = 4,
            comment = "Worst doctor ive ever seen. Arrogent, unhelpful, and just plain rude! Good looking though, 5/5 would visit again.",
            rating = 5
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/review", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD DOCTOR REVIEW INVALID, PATIENT NOT FOUND   ----
    [Fact]
    public async Task Post_AddDoctorReviewInvalid_PatientNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorReviewRequest()
        {
            doctorId = 2,
            patientId = 1,
            comment = "Worst doctor ive ever seen. Arrogent, unhelpful, and just plain rude! Good looking though, 5/5 would visit again.",
            rating = 5
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/review", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD DOCTOR REVIEW INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_AddDoctorReviewInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorReviewRequest()
        {
            doctorId = 2,
            patientId = 4,
            comment = "",
            rating = 5
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/review", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD DOCTOR REVIEW INVALID, RATING OUT OF RANGE, MORE THAN   ----
    [Fact]
    public async Task Post_AddDoctorReviewInvalid_RatingOutOfRange_MoreThan()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorReviewRequest()
        {
            doctorId = 2,
            patientId = 4,
            comment = "Worst doctor ive ever seen. Arrogent, unhelpful, and just plain rude! Good looking though, 5/5 would visit again.",
            rating = 7
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/review", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD DOCTOR REVIEW INVALID, RATING OUT OF RANGE, LESS THAN   ----
    [Fact]
    public async Task Post_AddDoctorReviewInvalid_RatingOutOfRange_LessThan()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorReviewRequest()
        {
            doctorId = 2,
            patientId = 4,
            comment = "Worst doctor ive ever seen. Arrogent, unhelpful, and just plain rude! Good looking though, 5/5 would visit again.",
            rating = -3
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/review", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD DOCTOR REVIEW INVALID, NOT A PATIENT TOKEN   ----
    [Fact]
    public async Task Post_AddDoctorReviewInvalid_NotAPatientToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddDoctorReviewRequest()
        {
            doctorId = 2,
            patientId = 4,
            comment = "Worst doctor ive ever seen. Arrogent, unhelpful, and just plain rude! Good looking though, 5/5 would visit again.",
            rating = 5
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/review", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET DOCTOR REVIEWS VALID   ----
    [Fact]
    public async Task GetDoctorReviewsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/doctor/reviews/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET DOCTOR REVIEWS INVALID, NO TOKEN   ----
    [Fact]
    public async Task GetDoctorReviewsInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/doctor/reviews/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   DELETE DOCTOR REVIEW VALID   ----
    [Fact]
    public async Task DeleteDoctorReviewValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.DeleteAsync("api/doctor/review/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE DOCTOR REVIEW INVALID, NOT FOUND   ----
    [Fact]
    public async Task DeleteDoctorReviewInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.DeleteAsync("api/doctor/review/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   DELETE DOCTOR REVIEW INVALID, NO TOKEN   ----
    [Fact]
    public async Task DeleteDoctorReviewInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.DeleteAsync("api/doctor/review/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    #endregion

    #region Doctor search tests

    //----   SEARCH DOCTORS BY SPECIALTY VALID   ----
    [Fact]
    public async Task SearchDoctorsBySpecialtyValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/doctor/search?specialtyId=2");

        Assert.True(response.IsSuccessStatusCode);

        JsonObject data = await response.Content.ReadFromJsonAsync<JsonObject>();
        Assert.True(data != null);
        Assert.True(data["data"] != null);
        _testOutputHelper.WriteLine(data["data"].ToString());
        Assert.True(data["data"] is JsonArray);
        Assert.True(((JsonArray)data["data"]).Count > 0);
    }

    //----   SEARCH DOCTORS BY NAME VALID   ----
    [Fact]
    public async Task SearchDoctorsByNameValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/doctor/search?firstName=DOcTor&lastName=ProCtOr");

        Assert.True(response.IsSuccessStatusCode);

        JsonObject data = await response.Content.ReadFromJsonAsync<JsonObject>();
        Assert.True(data != null);
        Assert.True(data["data"] != null);
        _testOutputHelper.WriteLine(data["data"].ToString());
        Assert.True(data["data"] is JsonArray);
        Assert.True(((JsonArray)data["data"]).Count > 0);
    }

    //----   SEARCH DOCTORS BY NATIONALITY VALID   ----
    [Fact]
    public async Task SearchDoctorsByNationalityValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/doctor/search?nationality=naMIbiAn");

        Assert.True(response.IsSuccessStatusCode);

        JsonObject data = await response.Content.ReadFromJsonAsync<JsonObject>();
        Assert.True(data != null);
        Assert.True(data["data"] != null);
        _testOutputHelper.WriteLine(data["data"].ToString());
        Assert.True(data["data"] is JsonArray);
        Assert.True(((JsonArray)data["data"]).Count > 0);
    }

    //----   SEARCH DOCTORS BY EMAIL VALID   ----
    [Fact]
    public async Task SearchDoctorsByEmailValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/doctor/search?email=DoC@");

        Assert.True(response.IsSuccessStatusCode);

        JsonObject data = await response.Content.ReadFromJsonAsync<JsonObject>();
        Assert.True(data != null);
        Assert.True(data["data"] != null);
        _testOutputHelper.WriteLine(data["data"].ToString());
        Assert.True(data["data"] is JsonArray);
        Assert.True(((JsonArray)data["data"]).Count > 0);
    }

    //----   SEARCH DOCTORS BY CITY VALID   ----
    [Fact]
    public async Task SearchDoctorsByCityValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/doctor/search?city=winD");

        Assert.True(response.IsSuccessStatusCode);

        JsonObject data = await response.Content.ReadFromJsonAsync<JsonObject>();
        Assert.True(data != null);
        Assert.True(data["data"] != null);
        _testOutputHelper.WriteLine(data["data"].ToString());
        Assert.True(data["data"] is JsonArray);
        Assert.True(((JsonArray)data["data"]).Count > 0);
    }

    #endregion
}