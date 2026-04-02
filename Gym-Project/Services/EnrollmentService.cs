using Microsoft.EntityFrameworkCore;
using GymProject.Database;
using GymProject.DTOs;
using GymProject.Interfaces;
using GymProject.Models;

namespace GymProject.Services;

public class EnrollmentService : IEnrollmentService
{
    private readonly ApplicationDbContext _context;

    public EnrollmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ClassEnrollmentDTO?> EnrollUserInClass(string userId, int gymClassId)
    {
        var exists = await _context.ClassEnrollments.AnyAsync(e => e.UserId == userId && e.GymClassId == gymClassId);
        if (exists) return null; // Already enrolled

        var enrollment = new ClassEnrollment
        {
            UserId = userId,
            GymClassId = gymClassId,
            EnrollmentDate = DateTime.UtcNow
        };

        _context.ClassEnrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        return await _context.ClassEnrollments
            .Where(e => e.UserId == userId && e.GymClassId == gymClassId)
            .Include(e => e.User)
            .Include(e => e.GymClass)
            .AsNoTracking()
            .Select(e => new ClassEnrollmentDTO
            {
                UserId = e.UserId,
                UserName = e.User.UserName!,
                GymClassId = e.GymClassId,
                GymClassTitle = e.GymClass.Title ?? string.Empty,
                EnrollmentDate = e.EnrollmentDate
            }).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<ClassEnrollmentDTO>> GetUserEnrollments(string userId)
    {
        return await _context.ClassEnrollments
            .Where(e => e.UserId == userId)
            .Include(e => e.User)
            .Include(e => e.GymClass)
            .AsNoTracking()
            .Select(e => new ClassEnrollmentDTO
            {
                UserId = e.UserId,
                UserName = e.User.UserName!,
                GymClassId = e.GymClassId,
                GymClassTitle = e.GymClass.Title ?? string.Empty,
                EnrollmentDate = e.EnrollmentDate
            }).ToListAsync();
    }
}
