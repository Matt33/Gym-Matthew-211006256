using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GymProject.DTOs;
using GymProject.Interfaces;

namespace GymProject.Controllers;
[Route("classes")]
[ApiController]
public class GymClassController : ControllerBase
{
    private readonly IGymClassService _gymClassService;

    public GymClassController(IGymClassService gymClassService)
    {
        _gymClassService = gymClassService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllGymClasses()
    {
        var gymClasses = await _gymClassService.GetAllGymClasses();
        return Ok(gymClasses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetGymClassById(int id)
    {
        var gymClass = await _gymClassService.GetGymClassById(id);
        if (gymClass == null) return NotFound();
        return Ok(gymClass);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Trainer")]
    public async Task<IActionResult> AddGymClass([FromBody] CreateGymClassDTO createDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var addedGymClass = await _gymClassService.AddGymClass(createDto);
        return CreatedAtAction(nameof(GetGymClassById), new { id = addedGymClass.Id }, addedGymClass);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Trainer")]
    public async Task<IActionResult> UpdateGymClass(int id, [FromBody] UpdateGymClassDTO updateDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var gymClass = await _gymClassService.UpdateGymClass(id, updateDto);
        if (gymClass == null) return NotFound();
        return Ok(gymClass);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Trainer")]
    public async Task<IActionResult> DeleteGymClass(int id)
    {
        await _gymClassService.DeleteGymClass(id);
        return NoContent();
    }

    [HttpGet("trainer/{trainerId}")]
    public async Task<IActionResult> GetGymClassesByTrainer(int trainerId)
    {
        var gymClasses = await _gymClassService.GetGymClassesByTrainerId(trainerId);
        return Ok(gymClasses);
    }
}
