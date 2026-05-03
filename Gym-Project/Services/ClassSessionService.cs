using Microsoft.EntityFrameworkCore;
using GymProject.Database;
using GymProject.DTOs;
using GymProject.Interfaces;
using GymProject.Models;

namespace GymProject.Services;

public class ClassSessionService : IClassSessionService
{
    private readonly ApplicationDbContext _context;

    public ClassSessionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ClassSessionDTO>> GetAllSessions()
    {
        return await _context.ClassSessions
            .Include(s => s.GymClass)
            .AsNoTracking()
            .OrderBy(s => s.SessionDate)
            .ThenBy(s => s.StartTime)
            .Select(s => MapToDto(s))
            .ToListAsync();
    }

    public async Task<IEnumerable<ClassSessionDTO>> GetSessionsByClassId(int gymClassId)
    {
        return await _context.ClassSessions
            .Where(s => s.GymClassId == gymClassId)
            .Include(s => s.GymClass)
            .AsNoTracking()
            .OrderBy(s => s.SessionDate)
            .ThenBy(s => s.StartTime)
            .Select(s => MapToDto(s))
            .ToListAsync();
    }

    public async Task<ClassSessionDTO?> GetSessionById(int id)
    {
        var s = await _context.ClassSessions
            .Include(s => s.GymClass)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id);

        return s == null ? null : MapToDto(s);
    }

    public async Task<ClassSessionDTO> CreateSession(CreateClassSessionDTO dto)
    {
        var session = new ClassSession
        {
            GymClassId = dto.GymClassId,
            SessionDate = DateTime.SpecifyKind(dto.SessionDate, DateTimeKind.Utc),
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Location = dto.Location,
            MaxCapacity = dto.MaxCapacity,
            CreatedAt = DateTime.UtcNow
        };

        _context.ClassSessions.Add(session);
        await _context.SaveChangesAsync();

        return (await GetSessionById(session.Id))!;
    }

    public async Task<ClassSessionDTO?> UpdateSession(int id, UpdateClassSessionDTO dto)
    {
        var session = await _context.ClassSessions.FindAsync(id);
        if (session == null) return null;

        session.SessionDate = DateTime.SpecifyKind(dto.SessionDate, DateTimeKind.Utc);
        session.StartTime = dto.StartTime;
        session.EndTime = dto.EndTime;
        session.Location = dto.Location;
        session.MaxCapacity = dto.MaxCapacity;

        await _context.SaveChangesAsync();
        return (await GetSessionById(id))!;
    }

    public async Task DeleteSession(int id)
    {
        var session = await _context.ClassSessions.FindAsync(id);
        if (session != null)
        {
            _context.ClassSessions.Remove(session);
            await _context.SaveChangesAsync();
        }
    }

    private static ClassSessionDTO MapToDto(ClassSession s) => new()
    {
        Id = s.Id,
        GymClassId = s.GymClassId,
        GymClassTitle = s.GymClass?.Title ?? "",
        SessionDate = s.SessionDate,
        StartTime = s.StartTime,
        EndTime = s.EndTime,
        Location = s.Location,
        MaxCapacity = s.MaxCapacity,
        CreatedAt = s.CreatedAt
    };
}
