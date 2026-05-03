using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GymProject.DTOs;
using GymProject.Interfaces;

namespace GymProject.Controllers;

[Route("api/sessions")]
[ApiController]
public class ClassSessionController : ControllerBase
{
    private readonly IClassSessionService _service;

    public ClassSessionController(IClassSessionService service)
    {
        _service = service;
    }

    // Anyone can view sessions (schedule)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var sessions = await _service.GetAllSessions();
        return Ok(sessions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var session = await _service.GetSessionById(id);
        if (session == null) return NotFound();
        return Ok(session);
    }

    [HttpGet("class/{gymClassId}")]
    public async Task<IActionResult> GetByClass(int gymClassId)
    {
        var sessions = await _service.GetSessionsByClassId(gymClassId);
        return Ok(sessions);
    }

    // Only Trainer/Admin can manage sessions
    [HttpPost]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateClassSessionDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var session = await _service.CreateSession(dto);
        return CreatedAtAction(nameof(GetById), new { id = session.Id }, session);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateClassSessionDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var session = await _service.UpdateSession(id, dto);
        if (session == null) return NotFound();
        return Ok(session);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteSession(id);
        return NoContent();
    }
}
