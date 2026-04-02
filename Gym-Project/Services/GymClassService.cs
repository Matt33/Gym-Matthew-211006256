using Microsoft.EntityFrameworkCore;
using GymProject.Database;
using GymProject.Interfaces;
using GymProject.Models;
using GymProject.DTOs;
namespace GymProject.Services;

public class GymClassService : IGymClassService
{
    ApplicationDbContext _context;
    
    public GymClassService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<GymClassDetailsDTO>> GetAllGymClasses()
    {
        return await _context.GymClasses.Include(g => g.Trainer).AsNoTracking().Select(g => new GymClassDetailsDTO
        {
            Id = g.Id,
            Title = g.Title,
            TrainerName = g.Trainer.Name,
            DurationInMinutes = g.DurationInMinutes
        }).ToListAsync();
    }

    public async Task<GymClassDetailsDTO?> GetGymClassById(int id)
    {
        return await _context.GymClasses.Where(g => g.Id == id).Include(g => g.Trainer).AsNoTracking().Select(g => new GymClassDetailsDTO
        {
            Id = g.Id,
            Title = g.Title,
            TrainerName = g.Trainer.Name,
            DurationInMinutes = g.DurationInMinutes
        }).FirstOrDefaultAsync();
    }

    public async Task<GymClassDetailsDTO> AddGymClass(CreateGymClassDTO createDto)
    {
        var gymClass = new GymClass
        {
            Title = createDto.Title,
            DurationInMinutes = createDto.DurationInMinutes,
            TrainerId = createDto.TrainerId,
            Trainer = null! // Handled by EF
        };
        _context.GymClasses.Add(gymClass);
        await _context.SaveChangesAsync();
        
        return await GetGymClassById(gymClass.Id) ?? throw new Exception("Error retrieving added class");
    }

    public async Task<GymClassDetailsDTO?> UpdateGymClass(int id, UpdateGymClassDTO updateDto)
    {
        var gymClass = await _context.GymClasses.FindAsync(id);
        if (gymClass == null)
        {
            return null;
        }
        gymClass.Title = updateDto.Title;
        gymClass.DurationInMinutes = updateDto.DurationInMinutes;
        gymClass.TrainerId = updateDto.TrainerId;
        
        await _context.SaveChangesAsync();
        return await GetGymClassById(id);
    }
    
    public async Task DeleteGymClass(int id)
    {
        var gymClass = await _context.GymClasses.FindAsync(id);
        if (gymClass != null)
        {
            _context.GymClasses.Remove(gymClass);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<GymClassDetailsDTO>> GetGymClassesByTrainerId(int trainerId)
    {
        return await _context.GymClasses.Where(g => g.TrainerId == trainerId).Include(g => g.Trainer).AsNoTracking().Select(g => new GymClassDetailsDTO
        {
            Id = g.Id,
            Title = g.Title,
            TrainerName = g.Trainer.Name,
            DurationInMinutes = g.DurationInMinutes
        }).ToListAsync();
    }

    public async Task<TrainerNameDTO?> GetTrainerName(int gymClassId)
    {
        return await _context.GymClasses.Where(g => g.Id == gymClassId).Include(g => g.Trainer).AsNoTracking().Select(g => new TrainerNameDTO
        {
            Name = g.Trainer.Name
        }).FirstOrDefaultAsync();
    }
}
