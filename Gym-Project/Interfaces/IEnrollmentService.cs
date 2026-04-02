using GymProject.DTOs;

namespace GymProject.Interfaces;

public interface IEnrollmentService
{
    Task<ClassEnrollmentDTO?> EnrollUserInClass(string userId, int gymClassId);
    Task<IEnumerable<ClassEnrollmentDTO>> GetUserEnrollments(string userId);
}
