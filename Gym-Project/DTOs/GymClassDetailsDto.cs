namespace GymProject.DTOs;

public class GymClassDetailsDTO
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string TrainerName { get; set; } = string.Empty;
    public int DurationInMinutes { get; set; }
}
