using SCA_ITS_back_end.Helpers;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Services;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Utilities;
using MailKit.Net.Smtp;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using PuppeteerSharp;
using PuppeteerSharp.Media;

namespace SCA_ITS_back_end.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : Controller
{
    private IConfiguration configuration;
    private IMailHandler mailHandler;
    private IS3Service s3Service;
    private MoodleService moodleService;
    private IViewRenderService _viewRenderService;
    private SCA_ITSContext dbContext;
    private IHttpClientFactory clientFactory;

    public TestController(IConfiguration configuration, IMailHandler mailHandler, IS3Service s3Service, IViewRenderService viewRenderService, SCA_ITSContext dbContext, MoodleService moodleService, IHttpClientFactory clientFactory)
    {
        this.configuration = configuration;
        this.mailHandler = mailHandler;
        this.s3Service = s3Service;
        this._viewRenderService = viewRenderService;
        this.dbContext = dbContext;
        this.moodleService = moodleService;
        this.clientFactory = clientFactory;
    }

    [HttpGet("mail/send")]
    public IActionResult SendMail()
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("SCA ITS", configuration["MailSettings:FromMail"]));
        message.To.Add(new MailboxAddress("john Adriaans", "adriaanscorne@gmail.com"));
        message.Body = new TextPart("Plain")
        {
            Text = "This is a test"
        };

        using (var client = new SmtpClient())
        {
            // client.ServerCertificateValidationCallback = (s, c, h, e) => true;
            client.Connect(configuration["MailSettings:Host"], Int32.Parse(configuration["MailSettings:Port"]));
            client.Authenticate(configuration["MailSettings:Username"], configuration["MailSettings:Password"]);
            client.Send(message);
            client.Disconnect(true);
        }

        return Ok();
    }

    [HttpGet("delete/file")]
    public IActionResult delFile()
    {
        s3Service.deleteObject("some-file");
        return Ok();
    }

    [HttpGet("pdf")]
    public async Task<IActionResult> getPdf()
    {
        await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
        {
            Headless = true,
            ExecutablePath = "/usr/bin/google-chrome-stable"
        });
        await using var page = await browser.NewPageAsync();
        await page.EmulateMediaTypeAsync(MediaType.Screen);
        await page.SetContentAsync("<div><img src=\"https://images.unsplash.com/photo-1587691592099-24045742c181?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=873&q=80\"/><h1>Hello PDF world!</h1><h2 style='color: red; text-align: center;'>Greetings from <i>HTML</i> world</h2></div>");
        var pdfContent = await page.PdfStreamAsync(new PdfOptions
        {
            Format = PaperFormat.A4,
            PrintBackground = true
        });
        return File(pdfContent, "application/pdf", "converted.pdf");
    }

    [HttpGet("report-html")]
    public async Task<IActionResult> getReportHtml()
    {
        var primaryReport = new PrimaryReport("john", "adriaans", "2", "2/10/2022", 1, "2022", 32);
        // primaryReport.addCoreSubjects(new List<string>() { "mmmmm mmmmmmmm ", "e", "s", "s", "y" });
        // primaryReport.addVocationalSubjects(new List<string>() { "c", "o", "d", "e" });
        // primaryReport.addSupportSubjects(new List<string>() { "m", "a", "n" });

        primaryReport.addCoreSubjects(new List<string>() { "mmmmm mmmmmmmm " });

        primaryReport.addTermRow(new List<decimal>() { 0 }, new List<decimal>() { 70 }, 1);
        primaryReport.addTermRow(new List<decimal>() { 0 }, new List<decimal>() { 70 }, 2);
        primaryReport.addTermRow(new List<decimal>() { 0 }, new List<decimal>() { 70 }, 3);
        primaryReport.addTermRow(new List<decimal>() { 0 }, new List<decimal>() { 70 }, 4);

        // primaryReport.addTermRow(new List<decimal>() { 0, 80, 70, 60, 50, 40, 50, 60, 70, 80, 90, 100 }, new List<decimal>() { 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 80 }, 1);
        // primaryReport.addTermRow(new List<decimal>() { 90, 80, 70, 60, 50, 40, 50, 60, 70, 80, 90, 100 }, new List<decimal>() { 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 80 }, 2);
        // primaryReport.addTermRow(new List<decimal>() { 90, 80, 70, 60, 50, 40, 50, 60, 70, 80, 90, 100 }, new List<decimal>() { 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 80 }, 3);
        // primaryReport.addTermRow(new List<decimal>() { 90, 80, 70, 60, 50, 40, 50, 60, 70, 80, 90, 100 }, new List<decimal>() { 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 80 }, 4);
        primaryReport.addProgressReportComments("hello");
        primaryReport.addProgressReportComments("hi");

        primaryReport.addCourseRemarks(new List<ReportCourseRemark>()
        {
            new ReportCourseRemark(){CourseName="Math 1",Remark="U suck"},
            new ReportCourseRemark(){CourseName="ENG 1",Remark="Los net"},
            new ReportCourseRemark(){CourseName="SCI 1",Remark="Disappointment"},
            new ReportCourseRemark(){CourseName="PT 1",Remark="Why are you even here"},
        });

        primaryReport.addPersonaMarks(new List<PersonaCategory>(){
            new PersonaCategory(){Id=1,Name="Work Habits"},
            new PersonaCategory(){Id=2,Name="Other stuff"},
            new PersonaCategory(){Id=3,Name="Idk"},
        }, new List<Persona>(){
            new Persona(){Id=1,Name="Follows instructions",PersonaCategoryId=1},

            new Persona(){Id=2,Name="Does stuff",PersonaCategoryId=2},

            new Persona(){Id=3,Name="Maybe",PersonaCategoryId=3},
        },
        new List<PersonaGrade>(){
            new PersonaGrade(){Id=1,PersonaId=1,Grade="E",Term=1},
            new PersonaGrade(){Id=2,PersonaId=1,Grade="E",Term=2},
            new PersonaGrade(){Id=3,PersonaId=1,Grade="E",Term=3},
            new PersonaGrade(){Id=4,PersonaId=1,Grade="E",Term=4},

            new PersonaGrade(){Id=5,PersonaId=2,Grade="S",Term=1},
            new PersonaGrade(){Id=6,PersonaId=2,Grade="S",Term=2},
            new PersonaGrade(){Id=7,PersonaId=2,Grade="S",Term=3},
            new PersonaGrade(){Id=8,PersonaId=2,Grade="S",Term=4},

            new PersonaGrade(){Id=9,PersonaId=3,Grade="D",Term=1},
            new PersonaGrade(){Id=10,PersonaId=3,Grade="D",Term=2},
            new PersonaGrade(){Id=11,PersonaId=3,Grade="D",Term=3},
            new PersonaGrade(){Id=12,PersonaId=3,Grade="D",Term=4},
        }, 1);

        primaryReport.addBriefComments("Its working");
        primaryReport.addBriefComments("Kinda");

        var html = await _viewRenderService.RenderToStringAsync("PrimaryReport", primaryReport);

        return Content(html, "text/html");
    }

    [HttpGet("report-html/pdf")]
    public async Task<IActionResult> getReportHtmlPdf()
    {
        var primaryReport = new PrimaryReport("john", "adriaans", "2", "2/10/2022", 1, "2022", 32);
        primaryReport.addCoreSubjects(new List<string>() { "mmmmm mmmmmmmm", "e", "s", "s", "y" });
        primaryReport.addVocationalSubjects(new List<string>() { "c", "o", "d", "e" });
        primaryReport.addSupportSubjects(new List<string>() { "m", "a", "n" });
        // primaryReport.addCoreSubjects(new List<string>() { "mmmmm  skdfjn ksjdfn ksjnf", "jnsdf kjnsdf", "kjsdfnksjdnf", "fsjnkjdfn" });
        // primaryReport.addVocationalSubjects(new List<string>() { "s sdkfjn", "kjsdnf" });
        // primaryReport.addSupportSubjects(new List<string>() { "s kjfsdn" });
        primaryReport.addTermRow(new List<decimal>() { 0, 80, 70, 60, 50, 40, 50, 60, 70, 80, 90, 100 }, new List<decimal>() { 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 80 }, 1);
        // primaryReport.addTermRow(new List<decimal>() { 0, 1 }, new List<decimal>() { 70, 90 }, 1);
        primaryReport.addTermRow(new List<decimal>() { 90, 80, 70, 60, 50, 40, 50, 60, 70, 80, 90, 100 }, new List<decimal>() { 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 80 }, 2);
        primaryReport.addTermRow(new List<decimal>() { 90, 80, 70, 60, 50, 40, 50, 60, 70, 80, 90, 100 }, new List<decimal>() { 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 80 }, 3);
        primaryReport.addTermRow(new List<decimal>() { 90, 80, 70, 60, 50, 40, 50, 60, 70, 80, 90, 100 }, new List<decimal>() { 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 80 }, 4);
        primaryReport.addProgressReportComments("hello");
        primaryReport.addProgressReportComments("hi");

        primaryReport.addCourseRemarks(new List<ReportCourseRemark>()
        {
            new ReportCourseRemark(){CourseName="Math 1",Remark="U suck"},
            new ReportCourseRemark(){CourseName="ENG 1",Remark="Los net"},
            new ReportCourseRemark(){CourseName="SCI 1",Remark="Disappointment"},
            new ReportCourseRemark(){CourseName="PT 1",Remark="Why are you even here"},
        });

        primaryReport.addPersonaMarks(new List<PersonaCategory>(){
            new PersonaCategory(){Id=1,Name="Work Habits"},
            new PersonaCategory(){Id=2,Name="Other stuff"},
            new PersonaCategory(){Id=3,Name="Idk"},
        }, new List<Persona>(){
            new Persona(){Id=1,Name="Follows instructions",PersonaCategoryId=1},

            new Persona(){Id=2,Name="Does stuff",PersonaCategoryId=2},

            new Persona(){Id=3,Name="Maybe",PersonaCategoryId=3},
        },
        new List<PersonaGrade>(){
            new PersonaGrade(){Id=1,PersonaId=1,Grade="E",Term=1},
            new PersonaGrade(){Id=2,PersonaId=1,Grade="E",Term=2},
            new PersonaGrade(){Id=3,PersonaId=1,Grade="E",Term=3},
            new PersonaGrade(){Id=4,PersonaId=1,Grade="E",Term=4},

            new PersonaGrade(){Id=5,PersonaId=2,Grade="S",Term=1},
            new PersonaGrade(){Id=6,PersonaId=2,Grade="S",Term=2},
            new PersonaGrade(){Id=7,PersonaId=2,Grade="S",Term=3},
            new PersonaGrade(){Id=8,PersonaId=2,Grade="S",Term=4},

            new PersonaGrade(){Id=9,PersonaId=3,Grade="D",Term=1},
            new PersonaGrade(){Id=10,PersonaId=3,Grade="D",Term=2},
            new PersonaGrade(){Id=11,PersonaId=3,Grade="D",Term=3},
            new PersonaGrade(){Id=12,PersonaId=3,Grade="D",Term=4},
        }, 1);

        primaryReport.addBriefComments("Its working");
        primaryReport.addBriefComments("Kinda");

        var html = await _viewRenderService.RenderToStringAsync("PrimaryReport", primaryReport);
        var header = await _viewRenderService.RenderToStringAsync("ReportHeader", new Object());

        var style = "<style> h1 { font-size:20px; margin-left:50px;}</style>";

        await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
        {
            Headless = true,
            ExecutablePath = "/usr/bin/google-chrome-stable"
        });
        await using var page = await browser.NewPageAsync();
        await page.EmulateMediaTypeAsync(MediaType.Screen);
        await page.SetContentAsync(html);
        var pdfContent = await page.PdfStreamAsync(new PdfOptions
        {
            Format = PaperFormat.A3,
            PrintBackground = true,
            DisplayHeaderFooter = true,
            HeaderTemplate = style + "<span><h1>hi</h1></span>",
            FooterTemplate = "<p>hello</p>",
            MarginOptions = new MarginOptions() { Bottom = "20px", Left = "20px", Right = "20px", Top = "20px" }
        });
        return File(pdfContent, "application/pdf", "converted.pdf");
    }


    [HttpGet("pre-report-html")]
    public async Task<IActionResult> getPreReportHtml()
    {

        var devGroups = await dbContext.DevelopmentGroups.ToListAsync();
        var devCategories = await dbContext.DevelopmentCategories.ToListAsync();
        var devAssessments = await dbContext.DevelopmentAssessments.ToListAsync();

        var assessmentGrades = new List<DevelopmentAssessmentGrade>();

        devAssessments.ForEach(ass =>
        {
            for (int i = 1; i <= 4; i++)
            {
                assessmentGrades.Add(new DevelopmentAssessmentGrade()
                {
                    Id = 1,
                    StudentProgressReportId = 1,
                    AssessmentId = ass.Id,
                    Term = i,
                    Grade = "2"
                });
            }
        });

        var prePrimaryReport = new PrePrimaryReport("john", "adriaans", "10", "2/10/2000", 4, "2022", 32);

        prePrimaryReport.remarks = "U are ass";
        prePrimaryReport.addAssessments(devGroups, devCategories, devAssessments, assessmentGrades, 4);

        var html = await _viewRenderService.RenderToStringAsync("PrePrimaryReport", prePrimaryReport);

        return Content(html, "text/html");
    }


    [HttpGet("pre-report-html/pdf")]
    public async Task<IActionResult> getPreReportPdf()
    {
        var devGroups = await dbContext.DevelopmentGroups.ToListAsync();
        var devCategories = await dbContext.DevelopmentCategories.ToListAsync();
        var devAssessments = await dbContext.DevelopmentAssessments.ToListAsync();

        var assessmentGrades = new List<DevelopmentAssessmentGrade>();

        devAssessments.ForEach(ass =>
        {
            for (int i = 1; i <= 4; i++)
            {
                assessmentGrades.Add(new DevelopmentAssessmentGrade()
                {
                    Id = 1,
                    StudentProgressReportId = 1,
                    AssessmentId = ass.Id,
                    Term = i,
                    Grade = "2"
                });
            }
        });

        var prePrimaryReport = new PrePrimaryReport("john", "adriaans", "10", "2/10/2000", 4, "2022", 32);

        prePrimaryReport.remarks = "U are ass";
        prePrimaryReport.addAssessments(devGroups, devCategories, devAssessments, assessmentGrades, 4);

        var html = await _viewRenderService.RenderToStringAsync("PrePrimaryReport", prePrimaryReport);

        await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
        {
            Headless = true,
            ExecutablePath = "/usr/bin/google-chrome-stable"
        });
        await using var page = await browser.NewPageAsync();
        await page.EmulateMediaTypeAsync(MediaType.Screen);
        await page.SetContentAsync(html);
        var pdfContent = await page.PdfStreamAsync(new PdfOptions
        {
            Format = PaperFormat.A3,
            PrintBackground = true
        });
        return File(pdfContent, "application/pdf", "converted.pdf");
    }

    [HttpGet("report-header-html")]
    public async Task<IActionResult> getReportHeaderHtml()
    {

        var html = await _viewRenderService.RenderToStringAsync("ReportHeader", new Object());

        return Content(html, "text/html");
    }

    [HttpGet("statement-html")]
    public async Task<IActionResult> getStatementHtml()
    {

        var statement = new FinancialStatement()
        {
            firstName = "john",
            lastName = "adriaans",
            date = DateOnly.FromDateTime(DateTime.Today).ToLongDateString(),
            address = "PO BOX 40449, AUSSPANN PLATZ, WINDHOEK, NAMIBIA",
            CurrentBalance = (decimal)309.99,

            statementItems = new List<StatementItem>(){
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },
                new StatementItem(){
                    Id=1,
                    StatementId=1,
                    Date=DateOnly.FromDateTime(DateTime.Today),
                    Reference="A REFERENCE",
                    Description="a very long ass description",
                    DebitAmount=(decimal)12,
                    CreditAmount=0
                },

            }
        };

        var html = await _viewRenderService.RenderToStringAsync("Statement", statement);

        return Content(html, "text/html");
    }


    [HttpGet("moodle/users/all")]
    public async Task<IActionResult> GetAllMoodleUsers()
    {
        var result = await moodleService.GetUsers(new MoodleGetUsersRequest
        {
            firstname = "%"
        });

        return Ok(result);
    }

    [HttpPost("moodle/courses/enrolled")]
    public async Task<IActionResult> GetAllEnrolledUsers(EnrolledData details)
    {

        Console.WriteLine(details.ToString());

        var dataToReturn = "[";
        for (int i = 0; i < details.ids.Count; i++)
        {
            using HttpClient client = clientFactory.CreateClient();

            var id = details.ids[i];


            var url = $"https://online.elearning-swakopca.edu.na/webservice/rest/server.php?wstoken=462463a8075beab0a5eb177e9c074d2c&wsfunction=core_enrol_get_enrolled_users&moodlewsrestformat=json&courseid={id}";
            var data = new Dictionary<string, string>
            {
            };
            var postData = new FormUrlEncodedContent(data);
            var res = await client.PostAsync(url, postData);
            var json = await res.Content.ReadAsStringAsync();
            dataToReturn += json;
        }
        dataToReturn += "]";

        return Ok(dataToReturn);
    }

}

public class EnrolledData
{
    public List<int> ids { get; set; }

}