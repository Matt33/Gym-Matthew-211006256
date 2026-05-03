using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymProject.Models;

public class WorkoutPlan
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public ApplicationUser User { get; set; } = null!;

    [Required]
    public string CreatedByTrainerId { get; set; } = string.Empty;

    [ForeignKey("CreatedByTrainerId")]
    public ApplicationUser CreatedByTrainer { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
