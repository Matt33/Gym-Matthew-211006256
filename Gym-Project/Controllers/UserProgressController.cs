using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GymProject.DTOs;
using GymProject.Interfaces;

namespace GymProject.Controllers;

[Route("api/progress")]
[ApiController]
[Authorize]
public class UserProgressController : ControllerBase
{
    private readonly IUserProgressService _service;

    public UserProgressController(IUserProgressService service)
    {
        _service = service;
    }

    // Trainer: get all progress records
    [HttpGet]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> GetAll()
    {
        var progress = await _service.GetAllProgress();
        return Ok(progress);
    }

    // Member: get own progress
    [HttpGet("my-progress")]
    public async Task<IActionResult> GetMyProgress()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var progress = await _service.GetProgressByUserId(userId);
        return Ok(progress);
    }

    // Trainer: get progress for a specific user
    [HttpGet("user/{userId}")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> GetByUser(string userId)
    {
        var progress = await _service.GetProgressByUserId(userId);
        return Ok(progress);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var progress = await _service.GetProgressById(id);
        if (progress == null) return NotFound();
        return Ok(progress);
    }

    // Trainer: create a progress entry for a user
    [HttpPost]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateUserProgressDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var trainerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(trainerId)) return Unauthorized();

        var progress = await _service.CreateProgress(dto, trainerId);
        return CreatedAtAction(nameof(GetById), new { id = progress.Id }, progress);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserProgressDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var progress = await _service.UpdateProgress(id, dto);
        if (progress == null) return NotFound();
        return Ok(progress);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteProgress(id);
        return NoContent();
    }
}
