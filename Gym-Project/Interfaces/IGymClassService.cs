using GymProject.DTOs;

namespace GymProject.Interfaces;

public interface IGymClassService
{
    Task<IEnumerable<GymClassDetailsDTO>> GetAllGymClasses();
    Task<GymClassDetailsDTO?> GetGymClassById(int id);
    Task<GymClassDetailsDTO> AddGymClass(CreateGymClassDTO createDto);
    Task<GymClassDetailsDTO?> UpdateGymClass(int id, UpdateGymClassDTO updateDto);
    Task DeleteGymClass(int id);
    Task <IEnumerable<GymClassDetailsDTO>> GetGymClassesByTrainerId(int trainerId);
    Task<TrainerNameDTO?> GetTrainerName(int gymClassId);
}
