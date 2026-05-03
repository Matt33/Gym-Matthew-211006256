using System.ComponentModel.DataAnnotations;

namespace GymProject.DTOs;

public class CreateClassSessionDTO
{
    [Required]
    public int GymClassId { get; set; }

    [Required]
    public DateTime SessionDate { get; set; }

    [Required]
    [MaxLength(50)]
    public string StartTime { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string EndTime { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Location { get; set; }

    public int MaxCapacity { get; set; } = 20;
}

public class UpdateClassSessionDTO
{
    [Required]
    public DateTime SessionDate { get; set; }

    [Required]
    [MaxLength(50)]
    public string StartTime { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string EndTime { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Location { get; set; }

    public int MaxCapacity { get; set; } = 20;
}

public class ClassSessionDTO
{
    public int Id { get; set; }
    public int GymClassId { get; set; }
    public string GymClassTitle { get; set; } = string.Empty;
    public DateTime SessionDate { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string? Location { get; set; }
    public int MaxCapacity { get; set; }
    public DateTime CreatedAt { get; set; }
}
