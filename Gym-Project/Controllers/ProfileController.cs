using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using GymProject.DTOs;
using GymProject.Models;

namespace GymProject.Controllers;

[Route("api/profile")]
[ApiController]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ProfileController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound();

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new UserProfileDTO
        {
            Id = user.Id,
            Email = user.Email ?? "",
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            Roles = roles
        });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound();

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.PhoneNumber = dto.PhoneNumber;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(new UserProfileDTO
        {
            Id = user.Id,
            Email = user.Email ?? "",
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            Roles = roles
        });
    }

    // Trainer/Admin: list all members
    [HttpGet("members")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> GetAllMembers()
    {
        var members = await _userManager.GetUsersInRoleAsync("Member");
        var result = members.Select(u => new UserProfileDTO
        {
            Id = u.Id,
            Email = u.Email ?? "",
            FirstName = u.FirstName,
            LastName = u.LastName,
            PhoneNumber = u.PhoneNumber,
            Roles = new List<string> { "Member" }
        });

        return Ok(result);
    }
}
