namespace GymProject.Models;

public class Trainer
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Specialization { get; set; }
    public DateTime BirthDate { get; set; }

    public List<GymClass> GymClasses { get; set; } = new List<GymClass>();
    public TrainerProfile? Profile { get; set; }
}
