using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GymProject.DTOs;
using GymProject.Interfaces;

namespace GymProject.Controllers;

[Route("api/workout-plans")]
[ApiController]
[Authorize]
public class WorkoutPlanController : ControllerBase
{
    private readonly IWorkoutPlanService _service;

    public WorkoutPlanController(IWorkoutPlanService service)
    {
        _service = service;
    }

    // Trainer: get all plans they created
    [HttpGet]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> GetAll()
    {
        var trainerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(trainerId)) return Unauthorized();

        var plans = await _service.GetWorkoutPlansByTrainerId(trainerId);
        return Ok(plans);
    }

    // Member: get their own plans
    [HttpGet("my-plans")]
    public async Task<IActionResult> GetMyPlans()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var plans = await _service.GetWorkoutPlansByUserId(userId);
        return Ok(plans);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var plan = await _service.GetWorkoutPlanById(id);
        if (plan == null) return NotFound();
        return Ok(plan);
    }

    // Trainer: get plans for a specific member
    [HttpGet("user/{userId}")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> GetByUser(string userId)
    {
        var plans = await _service.GetWorkoutPlansByUserId(userId);
        return Ok(plans);
    }

    [HttpPost]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateWorkoutPlanDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var trainerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(trainerId)) return Unauthorized();

        var plan = await _service.CreateWorkoutPlan(dto, trainerId);
        return CreatedAtAction(nameof(GetById), new { id = plan.Id }, plan);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateWorkoutPlanDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var plan = await _service.UpdateWorkoutPlan(id, dto);
        if (plan == null) return NotFound();
        return Ok(plan);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteWorkoutPlan(id);
        return NoContent();
    }
}
