using Microsoft.EntityFrameworkCore;
using GymProject.Database;
using GymProject.DTOs;
using GymProject.Interfaces;
using GymProject.Models;

namespace GymProject.Services;

public class WorkoutPlanService : IWorkoutPlanService
{
    private readonly ApplicationDbContext _context;

    public WorkoutPlanService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<WorkoutPlanDTO>> GetAllWorkoutPlans()
    {
        return await _context.WorkoutPlans
            .Include(w => w.User)
            .Include(w => w.CreatedByTrainer)
            .AsNoTracking()
            .OrderByDescending(w => w.CreatedAt)
            .Select(w => MapToDto(w))
            .ToListAsync();
    }

    public async Task<IEnumerable<WorkoutPlanDTO>> GetWorkoutPlansByUserId(string userId)
    {
        return await _context.WorkoutPlans
            .Where(w => w.UserId == userId)
            .Include(w => w.User)
            .Include(w => w.CreatedByTrainer)
            .AsNoTracking()
            .OrderByDescending(w => w.CreatedAt)
            .Select(w => MapToDto(w))
            .ToListAsync();
    }

    public async Task<IEnumerable<WorkoutPlanDTO>> GetWorkoutPlansByTrainerId(string trainerId)
    {
        return await _context.WorkoutPlans
            .Where(w => w.CreatedByTrainerId == trainerId)
            .Include(w => w.User)
            .Include(w => w.CreatedByTrainer)
            .AsNoTracking()
            .OrderByDescending(w => w.CreatedAt)
            .Select(w => MapToDto(w))
            .ToListAsync();
    }

    public async Task<WorkoutPlanDTO?> GetWorkoutPlanById(int id)
    {
        var w = await _context.WorkoutPlans
            .Include(w => w.User)
            .Include(w => w.CreatedByTrainer)
            .AsNoTracking()
            .FirstOrDefaultAsync(w => w.Id == id);

        return w == null ? null : MapToDto(w);
    }

    public async Task<WorkoutPlanDTO> CreateWorkoutPlan(CreateWorkoutPlanDTO dto, string trainerId)
    {
        var plan = new WorkoutPlan
        {
            Title = dto.Title,
            Description = dto.Description,
            UserId = dto.UserId,
            CreatedByTrainerId = trainerId,
            CreatedAt = DateTime.UtcNow
        };

        _context.WorkoutPlans.Add(plan);
        await _context.SaveChangesAsync();

        return (await GetWorkoutPlanById(plan.Id))!;
    }

    public async Task<WorkoutPlanDTO?> UpdateWorkoutPlan(int id, UpdateWorkoutPlanDTO dto)
    {
        var plan = await _context.WorkoutPlans.FindAsync(id);
        if (plan == null) return null;

        plan.Title = dto.Title;
        plan.Description = dto.Description;
        plan.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return (await GetWorkoutPlanById(id))!;
    }

    public async Task DeleteWorkoutPlan(int id)
    {
        var plan = await _context.WorkoutPlans.FindAsync(id);
        if (plan != null)
        {
            _context.WorkoutPlans.Remove(plan);
            await _context.SaveChangesAsync();
        }
    }

    private static WorkoutPlanDTO MapToDto(WorkoutPlan w) => new()
    {
        Id = w.Id,
        Title = w.Title,
        Description = w.Description,
        UserId = w.UserId,
        UserName = w.User?.UserName ?? "",
        CreatedByTrainerId = w.CreatedByTrainerId,
        TrainerName = w.CreatedByTrainer?.UserName ?? "",
        CreatedAt = w.CreatedAt,
        UpdatedAt = w.UpdatedAt
    };
}
