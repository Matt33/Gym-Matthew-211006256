namespace GymProject.DTOs;

public class TrainerDetailsDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Specialization { get; set; }
    public DateTime BirthDate { get; set; }
    public string Bio { get; set; } = string.Empty;
    public string? Certifications { get; set; }
}
