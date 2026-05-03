using System.ComponentModel.DataAnnotations;

namespace GymProject.DTOs;

public class CreateWorkoutPlanDTO
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;
}

public class UpdateWorkoutPlanDTO
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }
}

public class WorkoutPlanDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string CreatedByTrainerId { get; set; } = string.Empty;
    public string TrainerName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
