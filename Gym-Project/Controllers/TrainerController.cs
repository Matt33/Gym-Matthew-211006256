using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GymProject.DTOs;
using GymProject.Interfaces;

namespace GymProject.Controllers;
[Route("trainers")]
[ApiController]
public class TrainerController : ControllerBase
{
    private readonly ITrainerService _trainerService;

    public TrainerController(ITrainerService trainerService)
    {
        _trainerService = trainerService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTrainers()
    {
        var trainers = await _trainerService.GetAllTrainers();
        return Ok(trainers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTrainerById(int id)
    {
        var trainer = await _trainerService.GetTrainerById(id);
        if (trainer == null) return NotFound();
        return Ok(trainer);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddTrainer([FromBody] CreateTrainerDTO createDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var addedTrainer = await _trainerService.AddTrainer(createDto);
        return CreatedAtAction(nameof(GetTrainerById), new { id = addedTrainer.Id }, addedTrainer);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateTrainer(int id, [FromBody] UpdateTrainerDTO updateDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var trainer = await _trainerService.UpdateTrainer(id, updateDto);
        if (trainer == null) return NotFound();
        return Ok(trainer);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTrainer(int id)
    {
        await _trainerService.DeleteTrainer(id);
        return NoContent();
    }
}
