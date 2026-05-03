using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymProject.Models;

public class ClassSession
{
    public int Id { get; set; }

    [ForeignKey("GymClass")]
    public int GymClassId { get; set; }
    public GymClass GymClass { get; set; } = null!;

    [Required]
    public DateTime SessionDate { get; set; }

    [Required]
    [MaxLength(50)]
    public string StartTime { get; set; } = string.Empty; // e.g. "09:00"

    [Required]
    [MaxLength(50)]
    public string EndTime { get; set; } = string.Empty; // e.g. "10:00"

    [MaxLength(200)]
    public string? Location { get; set; }

    public int MaxCapacity { get; set; } = 20;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
