using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GymProject.Models;
using GymProject.DTOs;

namespace GymProject.Controllers;
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;

    public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, IWebHostEnvironment environment)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _environment = environment;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModelDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName,
            PhoneNumber = model.PhoneNumber
        };

        var result = await _userManager.CreateAsync(user, model.HashedPassword);
        if (result.Succeeded)
        {
            // Ensure the Member role exists and assign it to every new user
            if (!await _roleManager.RoleExistsAsync("Member"))
                await _roleManager.CreateAsync(new IdentityRole("Member"));

            await _userManager.AddToRoleAsync(user, "Member");

            var token = await GenerateJwtToken(user);
            SetTokenCookie(token);

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new { Message = "User registered successfully", Token = token, Roles = roles });
        }
        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModelDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return BadRequest(new { Message = "Invalid email or password" });
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, model.Password);
        if (!isPasswordValid)
        {
            return BadRequest(new { Message = "Invalid email or password" });
        }

        var token = await GenerateJwtToken(user);
        SetTokenCookie(token);

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(new { Message = "Login successful", Token = token, Roles = roles });
    }

    private async Task<string> GenerateJwtToken(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var userRoles = await _userManager.GetRolesAsync(user);
        foreach (var role in userRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private void SetTokenCookie(string token)
    {
        Response.Cookies.Append("jwt", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = !_environment.IsDevelopment(),
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddHours(1)
        });
    }
}
