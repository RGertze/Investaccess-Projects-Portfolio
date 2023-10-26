using System.Threading.Tasks;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        try
        {
            var result = await _authService.Login(new User
            {
                Email = request.email,
                Password = request.password
            });

            return StatusCode(result.statusCode, result);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error:" + ex.Message);
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        try
        {
            var result = await _authService.Register(new User
            {
                Email = request.email,
                Password = request.password,
            });

            return StatusCode(result.statusCode, result);
        }
        catch (Exception ex)
        {

            Console.WriteLine("Error:" + ex.Message);
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken(ApiTokens request)
    {
        try
        {
            var result = await _authService.RefreshToken(request);

            if (result.statusCode == 200)
                return Ok(result.data);

            return StatusCode(result.statusCode, result);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error:" + ex.Message);
            return StatusCode(500, ex.Message);
        }
    }
}