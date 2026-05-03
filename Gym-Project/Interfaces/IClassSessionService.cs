using GymProject.DTOs;

namespace GymProject.Interfaces;

public interface IClassSessionService
{
    Task<IEnumerable<ClassSessionDTO>> GetAllSessions();
    Task<IEnumerable<ClassSessionDTO>> GetSessionsByClassId(int gymClassId);
    Task<ClassSessionDTO?> GetSessionById(int id);
    Task<ClassSessionDTO> CreateSession(CreateClassSessionDTO dto);
    Task<ClassSessionDTO?> UpdateSession(int id, UpdateClassSessionDTO dto);
    Task DeleteSession(int id);
}
