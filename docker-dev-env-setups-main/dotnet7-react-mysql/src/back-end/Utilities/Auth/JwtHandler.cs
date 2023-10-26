using System.CodeDom.Compiler;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace back_end.Utilities;

public class JwtHandler
{
    private readonly IConfiguration configuration;

    public JwtHandler(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    //----   GENERATE JWT TOKEN   ----
    public string generate(int userId, int roleId)
    {
        var claims = new List<Claim>(){
            new Claim("userId",userId.ToString()),
            new Claim("roleId",roleId.ToString())
        };

        // create and return token
        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));
        var token = new JwtSecurityToken(
            issuer: configuration["JWT:ValidIssuer"],
            // expires: DateTime.Now.AddHours(3),
            expires: DateTime.Now.AddMinutes(20),
            claims: claims,
            signingCredentials: new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256)
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    //----   GENERATE REFRESH TOKEN   ----
    public string generateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

    //----   GET CLAIMS PRINCIPAL FROM EXPIRED TOKEN   ----
    public ClaimsPrincipal? getPrincipalFromExpiredToken(string token)
    {
        try
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["JWT:ValidIssuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            JwtSecurityToken? jwtSecurityToken = securityToken as JwtSecurityToken;

            // return null if token invalid
            if (jwtSecurityToken is null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                return null;
            }

            return principal;
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return null;
        }
    }

    //----   GENERATE EXPIRED JWT TOKEN   ----
    public string generateExpired(int userId, int roleId)
    {
        // create claims
        var claims = new List<Claim>(){

            new Claim("userId",userId.ToString()),
            new Claim("roleId",roleId.ToString())
        };

        // Console.WriteLine(claims[0].ToString());

        // create and return token
        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));
        var token = new JwtSecurityToken(
            issuer: configuration["JWT:ValidIssuer"],
            expires: DateTime.Now.AddHours(-3),
            claims: claims,
            signingCredentials: new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256)
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}