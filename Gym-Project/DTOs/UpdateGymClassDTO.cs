using System.ComponentModel.DataAnnotations;

namespace GymProject.DTOs;

public class UpdateGymClassDTO
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [Range(10, 300)]
    public int DurationInMinutes { get; set; }

    [Required]
    public int TrainerId { get; set; }
}
