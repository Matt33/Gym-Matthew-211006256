using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using GymProject.Models;
namespace GymProject.Database;


public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    public DbSet<GymClass> GymClasses { get; set; } 
    public DbSet<Trainer> Trainers { get; set; }
    public DbSet<TrainerProfile> TrainerProfiles { get; set; }
    public DbSet<ClassEnrollment> ClassEnrollments { get; set; }
    public DbSet<WorkoutPlan> WorkoutPlans { get; set; }
    public DbSet<ClassSession> ClassSessions { get; set; }
    public DbSet<UserProgress> UserProgresses { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure Many-to-Many key
        builder.Entity<ClassEnrollment>()
            .HasKey(e => new { e.UserId, e.GymClassId });

        // Configure One-to-One
        builder.Entity<Trainer>()
            .HasOne(t => t.Profile)
            .WithOne(p => p.Trainer)
            .HasForeignKey<TrainerProfile>(p => p.TrainerId);

        // WorkoutPlan — disable cascade on both FKs to avoid multiple cascade paths
        builder.Entity<WorkoutPlan>()
            .HasOne(w => w.User)
            .WithMany()
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<WorkoutPlan>()
            .HasOne(w => w.CreatedByTrainer)
            .WithMany()
            .HasForeignKey(w => w.CreatedByTrainerId)
            .OnDelete(DeleteBehavior.Restrict);

        // UserProgress — disable cascade on both FKs
        builder.Entity<UserProgress>()
            .HasOne(u => u.User)
            .WithMany()
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<UserProgress>()
            .HasOne(u => u.RecordedByTrainer)
            .WithMany()
            .HasForeignKey(u => u.RecordedByTrainerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
