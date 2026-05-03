using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymProject.Models;

public class UserProgress
{
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public ApplicationUser User { get; set; } = null!;

    public double? Weight { get; set; } // in kg

    [MaxLength(500)]
    public string? PerformanceNotes { get; set; }

    [MaxLength(300)]
    public string? Goals { get; set; }

    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

    public string? RecordedByTrainerId { get; set; }

    [ForeignKey("RecordedByTrainerId")]
    public ApplicationUser? RecordedByTrainer { get; set; }
}
