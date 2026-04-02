using Microsoft.EntityFrameworkCore;
using GymProject.Database;
using GymProject.DTOs;
using GymProject.Interfaces;
using GymProject.Models;

namespace GymProject.Services;

public class TrainerService : ITrainerService
{
    private readonly ApplicationDbContext _context;

    public TrainerService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TrainerDetailsDTO>> GetAllTrainers()
    {
        return await _context.Trainers.Include(t => t.Profile).AsNoTracking().Select(t => new TrainerDetailsDTO
        {
            Id = t.Id,
            Name = t.Name,
            Specialization = t.Specialization,
            BirthDate = t.BirthDate,
            Bio = t.Profile != null ? t.Profile.Bio : string.Empty,
            Certifications = t.Profile != null ? t.Profile.Certifications : string.Empty
        }).ToListAsync();
    }

    public async Task<TrainerDetailsDTO?> GetTrainerById(int id)
    {
        return await _context.Trainers.Where(t => t.Id == id).Include(t => t.Profile).AsNoTracking().Select(t => new TrainerDetailsDTO
        {
            Id = t.Id,
            Name = t.Name,
            Specialization = t.Specialization,
            BirthDate = t.BirthDate,
            Bio = t.Profile != null ? t.Profile.Bio : string.Empty,
            Certifications = t.Profile != null ? t.Profile.Certifications : string.Empty
        }).FirstOrDefaultAsync();
    }

    public async Task<TrainerDetailsDTO> AddTrainer(CreateTrainerDTO createDto)
    {
        var trainer = new Trainer
        {
            Name = createDto.Name,
            Specialization = createDto.Specialization,
            BirthDate = createDto.BirthDate,
            Profile = new TrainerProfile
            {
                Bio = createDto.Bio,
                Certifications = createDto.Certifications
            }
        };
        _context.Trainers.Add(trainer);
        await _context.SaveChangesAsync();
        
        return await GetTrainerById(trainer.Id) ?? throw new Exception("Error retrieving added trainer");
    }

    public async Task<TrainerDetailsDTO?> UpdateTrainer(int id, UpdateTrainerDTO updateDto)
    {
        var trainer = await _context.Trainers.Include(t => t.Profile).FirstOrDefaultAsync(t => t.Id == id);
        if (trainer == null) return null;

        trainer.Name = updateDto.Name;
        trainer.Specialization = updateDto.Specialization;
        trainer.BirthDate = updateDto.BirthDate;
        
        if (trainer.Profile == null)
        {
            trainer.Profile = new TrainerProfile { Bio = updateDto.Bio, Certifications = updateDto.Certifications };
        }
        else
        {
            trainer.Profile.Bio = updateDto.Bio;
            trainer.Profile.Certifications = updateDto.Certifications;
        }

        await _context.SaveChangesAsync();
        return await GetTrainerById(id);
    }

    public async Task DeleteTrainer(int id)
    {
        var trainer = await _context.Trainers.FindAsync(id);
        if (trainer != null)
        {
            _context.Trainers.Remove(trainer);
            await _context.SaveChangesAsync();
        }
    }
}
