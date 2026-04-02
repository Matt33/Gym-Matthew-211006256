using System.ComponentModel.DataAnnotations;
namespace GymProject.DTOs;

public class TrainerNameDTO
{
    [Required]
    [MinLength(3)]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
}
