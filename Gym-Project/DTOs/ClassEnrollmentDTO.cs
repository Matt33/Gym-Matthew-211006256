namespace GymProject.DTOs;

public class ClassEnrollmentDTO
{
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public int GymClassId { get; set; }
    public string GymClassTitle { get; set; } = string.Empty;
    public int DurationInMinutes { get; set; }
    public string TrainerName { get; set; } = string.Empty;
    public DateTime EnrollmentDate { get; set; }
}
