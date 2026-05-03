using System.ComponentModel.DataAnnotations;

namespace GymProject.DTOs;

public class CreateUserProgressDTO
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    public double? Weight { get; set; }

    [MaxLength(500)]
    public string? PerformanceNotes { get; set; }

    [MaxLength(300)]
    public string? Goals { get; set; }
}

public class UserProgressDTO
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public double? Weight { get; set; }
    public string? PerformanceNotes { get; set; }
    public string? Goals { get; set; }
    public DateTime RecordedAt { get; set; }
    public string? RecordedByTrainerId { get; set; }
    public string? TrainerName { get; set; }
}

public class UpdateUserProgressDTO
{
    public double? Weight { get; set; }

    [MaxLength(500)]
    public string? PerformanceNotes { get; set; }

    [MaxLength(300)]
    public string? Goals { get; set; }
}

public class UserProfileDTO
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public IList<string> Roles { get; set; } = new List<string>();
}

public class UpdateProfileDTO
{
    [Required]
    [MinLength(1)]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Phone]
    public string? PhoneNumber { get; set; }
}
