using GymProject.DTOs;

namespace GymProject.Interfaces;

public interface IUserProgressService
{
    Task<IEnumerable<UserProgressDTO>> GetAllProgress();
    Task<IEnumerable<UserProgressDTO>> GetProgressByUserId(string userId);
    Task<UserProgressDTO?> GetProgressById(int id);
    Task<UserProgressDTO> CreateProgress(CreateUserProgressDTO dto, string trainerId);
    Task<UserProgressDTO?> UpdateProgress(int id, UpdateUserProgressDTO dto);
    Task DeleteProgress(int id);
}
