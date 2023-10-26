using MailKit.Net.Smtp;
using MimeKit;

namespace SCA_ITS_back_end.Helpers;

public interface IMailHandler
{
    void sendMessage(MimeMessage message, int retry = 1);
}

public class MailHandler : IMailHandler
{

    private readonly IConfiguration configuration;
    private readonly SmtpClient client;

    public MailHandler(IConfiguration configuration)
    {
        this.configuration = configuration;

        this.client = new SmtpClient();
        this.client.ServerCertificateValidationCallback = (s, c, h, e) => true;
    }

    public async void sendMessage(MimeMessage message, int retry = 1)
    {
        try
        {
            await this.client.ConnectAsync(configuration["MailSettings:Host"], Int32.Parse(configuration["MailSettings:Port"]));
            await client.AuthenticateAsync(configuration["MailSettings:Username"], configuration["MailSettings:Password"]);

            // send message
            await client.SendAsync(message);

            Console.WriteLine("Message sent");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            // retry max of 2 times if it was a disconnect error
            if (ex.GetType() == typeof(MailKit.ServiceNotConnectedException))
            {
                if (retry < 3)
                {
                    sendMessage(message, retry + 1);
                }
            }
        }
    }

}