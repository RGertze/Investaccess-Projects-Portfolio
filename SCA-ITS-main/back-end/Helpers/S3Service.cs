using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using SCA_ITS_back_end.Models;

namespace SCA_ITS_back_end.Helpers;

public interface IS3Service
{
    string getPresignedGetUrl(string filePath);
    string getPresignedPutUrl(string filename);
    Task<Boolean> deleteObject(string filePath);
    Task<Boolean> uploadStreamObject(string filePath, Stream file);

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

    //----   DELETE OBJECT   ----
    public async Task<bool> deleteObject(string filePath)
    {
        try
        {
            DeleteObjectRequest request = new DeleteObjectRequest()
            {
                BucketName = configuration["AWS:BucketName"],
                Key = filePath
            };
            await client.DeleteObjectAsync(request);

            return true;
        }
        catch (AmazonS3Exception ex)
        {
            Console.WriteLine("Error encountered on server. Message:'{0}' when deleting an object", ex.Message);
            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine("Unknown encountered on server. Message:'{0}' when deleting an object", ex.Message);
            return false;
        }
    }

    //----   UPLOAD STREAM OBJECT   ----
    public async Task<bool> uploadStreamObject(string filePath, Stream file)
    {
        try
        {
            var fileTransferUtility = new TransferUtility(this.client);

            await fileTransferUtility.UploadAsync(file, configuration["AWS:BucketName"], filePath);

            return true;
        }
        catch (AmazonS3Exception ex)
        {
            Console.WriteLine($"Error encountered on S3 server. Message:'{ex.Message}' when uploading stream object");
            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unknown error encountered. Message:'{ex.Message}' when uploading stream object");
            return false;
        }
    }
}