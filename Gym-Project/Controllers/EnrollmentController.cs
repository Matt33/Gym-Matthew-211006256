using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GymProject.Interfaces;

namespace GymProject.Controllers;
[Route("enrollments")]
[ApiController]
[Authorize]
public class EnrollmentController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;

    public EnrollmentController(IEnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    [HttpPost("{gymClassId}")]
    [Authorize(Roles = "Member")]
    public async Task<IActionResult> EnrollInClass(int gymClassId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var enrollment = await _enrollmentService.EnrollUserInClass(userId, gymClassId);
        if (enrollment == null)
        {
            return BadRequest(new { Message = "Already enrolled or invalid class." });
        }

        return Ok(enrollment);
    }

    [HttpGet("my-classes")]
    public async Task<IActionResult> GetMyClasses()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var enrollments = await _enrollmentService.GetUserEnrollments(userId);
        return Ok(enrollments);
    }

    [HttpDelete("{gymClassId}")]
    [Authorize(Roles = "Member")]
    public async Task<IActionResult> Unenroll(int gymClassId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var success = await _enrollmentService.UnenrollUser(userId, gymClassId);
        if (!success) return NotFound(new { Message = "Enrollment not found." });

        return NoContent();
    }
}
