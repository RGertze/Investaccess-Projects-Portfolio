using back_end.Data;
using back_end.Models;
using back_end.Utilities;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services;

public class AuthService
{
    private readonly ApplicationDBContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDBContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<Result> Register(User user)
    {
        var result = new Result();
        try
        {
            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                result.statusCode = 400;
                result.message = "Email and password are required";
                return result;
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                result.statusCode = 409;
                result.message = "User already exists";
                return result;
            }

            user.RoleId = (int)ROLES.USER;
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.EmailConfirmationToken = Guid.NewGuid().ToString();
            user.EmailConfirmed = true;
            user.RefreshToken = Guid.NewGuid().ToString();

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            result.statusCode = 201;
            result.message = "User created successfully";
            result.data = user;
            return result;
        }
        catch (Exception e)
        {
            result.statusCode = 500;
            result.message = e.Message;
            return result;
        }
    }

    // create login method
    public async Task<Result> Login(User user)
    {
        var result = new Result
        {
            statusCode = 0,
            message = "",
            data = ""
        };
        try
        {
            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                result.statusCode = 400;
                result.message = "Email and password are required";
                return result;
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser == null)
            {
                result.statusCode = 404;
                result.message = "User does not exist";
                return result;
            }
            if (!BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password))
            {
                result.statusCode = 400;
                result.message = "Invalid credentials";
                return result;
            }

            if (!existingUser.EmailConfirmed)
            {
                result.statusCode = 400;
                result.message = "Please confirm your email";
                return result;
            }

            var jwtHandler = new JwtHandler(_configuration);
            var token = jwtHandler.generate(existingUser.Id, existingUser.RoleId);
            var refreshToken = jwtHandler.generateRefreshToken();

            existingUser.RefreshToken = refreshToken;
            _context.Users.Update(existingUser);
            await _context.SaveChangesAsync();

            result.statusCode = 200;
            result.message = "User logged in successfully";
            result.data = new LoginResponse
            {
                id = existingUser.Id,
                roleId = existingUser.RoleId,
                emailConfirmed = true,
                tokens = new ApiTokens
                {
                    token = token,
                    refreshToken = refreshToken
                }
            };
            return result;
        }
        catch (Exception e)
        {
            result.statusCode = 500;
            result.message = e.Message;
            return result;
        }
    }

    public async Task<Result> CreateUser(User user)
    {
        try
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                return new Result
                {
                    statusCode = 400,
                    message = "User already exists",
                    data = ""
                };
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.EmailConfirmationToken = Guid.NewGuid().ToString();
            user.EmailConfirmed = true;
            user.RefreshToken = "";

            var created = await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return new Result
            {
                statusCode = 201,
                message = "User created successfully",
                data = created
            };
        }
        catch (Exception e)
        {
            return new Result
            {
                statusCode = 500,
                message = e.Message,
                data = ""
            };
        }
    }

    public async Task<Result> RefreshToken(ApiTokens tokens)
    {
        try
        {
            var jwtHandler = new JwtHandler(_configuration);

            // get token details 
            var principal = jwtHandler.getPrincipalFromExpiredToken(tokens.token);

            // check if token is valid
            if (principal is null)
            {
                return new Result
                {
                    statusCode = 400,
                    message = "Invalid token provided",
                    data = ""
                };
            }

            // get userId and roleId from claims
            var uClaim = principal.Claims.Where(c => c.Type == "userId").FirstOrDefault();
            var rClaim = principal.Claims.Where(c => c.Type == "roleId").FirstOrDefault();

            if (uClaim is null || rClaim is null)
            {
                return new Result
                {
                    statusCode = 400,
                    message = "Invalid claims",
                    data = ""
                };
            }

            var userId = uClaim.Value;
            var roleId = rClaim.Value;

            // get user
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == Int32.Parse(userId));
            if (user is null)
            {
                return new Result
                {
                    statusCode = 404,
                    message = "User not found",
                    data = ""
                };
            }

            // check if refresh tokens matches 
            if (user.RefreshToken != tokens.refreshToken)
            {
                return new Result
                {
                    statusCode = 401,
                    message = "Invalid refresh token",
                    data = ""
                };
            }

            // generate new tokens
            var newToken = jwtHandler.generate(Int32.Parse(userId), Int32.Parse(roleId));
            var newRefreshToken = jwtHandler.generateRefreshToken();

            // save refresh token in db
            user.RefreshToken = newRefreshToken;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // return tokens
            return new Result
            {
                statusCode = 200,
                message = "Tokens refreshed successfully",
                data = new ApiTokens
                {
                    token = newToken,
                    refreshToken = newRefreshToken
                }
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            };
        }
    }
}