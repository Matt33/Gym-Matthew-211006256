using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymProject.Models;

public class TrainerProfile
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(500)]
    public string Bio { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Certifications { get; set; }

    [ForeignKey("Trainer")]
    public int TrainerId { get; set; }
    public Trainer Trainer { get; set; } = null!;
}
