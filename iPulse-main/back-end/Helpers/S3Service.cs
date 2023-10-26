using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using iPulse_back_end.Models;

namespace iPulse_back_end.Helpers;

public interface IS3Service
{
    string getPresignedGetUrl(string filePath);
    string getPresignedPutUrl(string filename);
    void deleteObject();
    void deleteObjects();
}

public class S3Service : IS3Service
{
    private readonly IConfiguration configuration;
    private AmazonS3Client client;

    public S3Service(IConfiguration configuration)
    {
        this.configuration = configuration;
        this.client = new AmazonS3Client(configuration["AWS:AccessId"], configuration["AWS:SecretKey"], RegionEndpoint.EUWest3);
    }

    public void deleteObject()
    {
        throw new NotImplementedException();
    }

    public void deleteObjects()
    {
        throw new NotImplementedException();
    }

    //----   GET SIGNED GET URL   ----
    public string getPresignedGetUrl(string filePath)
    {
        GetPreSignedUrlRequest request = new GetPreSignedUrlRequest()
        {
            BucketName = configuration["AWS:BucketName"],
            Key = filePath,
            Expires = DateTime.Now.AddMinutes(1)
        };

        return client.GetPreSignedURL(request);
    }

    //----   GET SIGNED PUT URL   ----
    public string getPresignedPutUrl(string filePath)
    {
        GetPreSignedUrlRequest request = new GetPreSignedUrlRequest()
        {
            BucketName = configuration["AWS:BucketName"],
            Key = filePath,
            Verb = HttpVerb.PUT,
            Expires = DateTime.Now.AddMinutes(10)
        };

        return client.GetPreSignedURL(request);
    }
}