using System.ComponentModel.DataAnnotations;

namespace GymProject.DTOs;

public class UpdateTrainerDTO
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Specialization { get; set; }

    public DateTime BirthDate { get; set; }

    [Required]
    [StringLength(500)]
    public string Bio { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Certifications { get; set; }
}
