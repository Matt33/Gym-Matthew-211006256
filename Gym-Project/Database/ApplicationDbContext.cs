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
    }
}
