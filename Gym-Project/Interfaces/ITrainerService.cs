using GymProject.DTOs;

namespace GymProject.Interfaces;

public interface ITrainerService
{
    Task<IEnumerable<TrainerDetailsDTO>> GetAllTrainers();
    Task<TrainerDetailsDTO?> GetTrainerById(int id);
    Task<TrainerDetailsDTO> AddTrainer(CreateTrainerDTO createDto);
    Task<TrainerDetailsDTO?> UpdateTrainer(int id, UpdateTrainerDTO updateDto);
    Task DeleteTrainer(int id);
}
