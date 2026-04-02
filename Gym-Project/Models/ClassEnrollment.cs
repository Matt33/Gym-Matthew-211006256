using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymProject.Models;

public class ClassEnrollment
{
    [ForeignKey("User")]
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    [ForeignKey("GymClass")]
    public int GymClassId { get; set; }
    public GymClass GymClass { get; set; } = null!;

    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
}
