using Microsoft.EntityFrameworkCore;
using GymProject.Database;
using GymProject.DTOs;
using GymProject.Interfaces;
using GymProject.Models;

namespace GymProject.Services;

public class UserProgressService : IUserProgressService
{
    private readonly ApplicationDbContext _context;

    public UserProgressService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserProgressDTO>> GetAllProgress()
    {
        return await _context.UserProgresses
            .Include(p => p.User)
            .Include(p => p.RecordedByTrainer)
            .AsNoTracking()
            .OrderByDescending(p => p.RecordedAt)
            .Select(p => MapToDto(p))
            .ToListAsync();
    }

    public async Task<IEnumerable<UserProgressDTO>> GetProgressByUserId(string userId)
    {
        return await _context.UserProgresses
            .Where(p => p.UserId == userId)
            .Include(p => p.User)
            .Include(p => p.RecordedByTrainer)
            .AsNoTracking()
            .OrderByDescending(p => p.RecordedAt)
            .Select(p => MapToDto(p))
            .ToListAsync();
    }

    public async Task<UserProgressDTO?> GetProgressById(int id)
    {
        var p = await _context.UserProgresses
            .Include(p => p.User)
            .Include(p => p.RecordedByTrainer)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        return p == null ? null : MapToDto(p);
    }

    public async Task<UserProgressDTO> CreateProgress(CreateUserProgressDTO dto, string trainerId)
    {
        var progress = new UserProgress
        {
            UserId = dto.UserId,
            Weight = dto.Weight,
            PerformanceNotes = dto.PerformanceNotes,
            Goals = dto.Goals,
            RecordedAt = DateTime.UtcNow,
            RecordedByTrainerId = trainerId
        };

        _context.UserProgresses.Add(progress);
        await _context.SaveChangesAsync();

        return (await GetProgressById(progress.Id))!;
    }

    public async Task<UserProgressDTO?> UpdateProgress(int id, UpdateUserProgressDTO dto)
    {
        var progress = await _context.UserProgresses.FindAsync(id);
        if (progress == null) return null;

        progress.Weight = dto.Weight;
        progress.PerformanceNotes = dto.PerformanceNotes;
        progress.Goals = dto.Goals;

        await _context.SaveChangesAsync();
        return await GetProgressById(id);
    }

    public async Task DeleteProgress(int id)
    {
        var progress = await _context.UserProgresses.FindAsync(id);
        if (progress != null)
        {
            _context.UserProgresses.Remove(progress);
            await _context.SaveChangesAsync();
        }
    }

    private static UserProgressDTO MapToDto(UserProgress p) => new()
    {
        Id = p.Id,
        UserId = p.UserId,
        UserName = p.User?.UserName ?? "",
        Weight = p.Weight,
        PerformanceNotes = p.PerformanceNotes,
        Goals = p.Goals,
        RecordedAt = p.RecordedAt,
        RecordedByTrainerId = p.RecordedByTrainerId,
        TrainerName = p.RecordedByTrainer?.UserName ?? ""
    };
}
