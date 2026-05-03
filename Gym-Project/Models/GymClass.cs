using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymProject.Models;

public class GymClass
{
    public int Id { get; set; }
    
    [StringLength(200)]
    public string? Title { get; set; }
    
    public Trainer? Trainer { get; set; }
    
    public int DurationInMinutes { get; set; }
    
    [ForeignKey("Trainer")]
    public int TrainerId { get; set; }

    public ICollection<ClassEnrollment> Enrollments { get; set; } = new List<ClassEnrollment>();
}
