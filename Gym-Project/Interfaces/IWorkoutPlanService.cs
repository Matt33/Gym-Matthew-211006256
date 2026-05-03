using GymProject.DTOs;

namespace GymProject.Interfaces;

public interface IWorkoutPlanService
{
    Task<IEnumerable<WorkoutPlanDTO>> GetAllWorkoutPlans();
    Task<IEnumerable<WorkoutPlanDTO>> GetWorkoutPlansByUserId(string userId);
    Task<IEnumerable<WorkoutPlanDTO>> GetWorkoutPlansByTrainerId(string trainerId);
    Task<WorkoutPlanDTO?> GetWorkoutPlanById(int id);
    Task<WorkoutPlanDTO> CreateWorkoutPlan(CreateWorkoutPlanDTO dto, string trainerId);
    Task<WorkoutPlanDTO?> UpdateWorkoutPlan(int id, UpdateWorkoutPlanDTO dto);
    Task DeleteWorkoutPlan(int id);
}
