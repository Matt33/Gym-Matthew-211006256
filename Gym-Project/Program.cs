using GymProject.Interfaces;
using GymProject.Services;
using GymProject.Database;
using Microsoft.EntityFrameworkCore;
using GymProject.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddScoped<IGymClassService, GymClassService>();
builder.Services.AddScoped<ITrainerService, TrainerService>();
builder.Services.AddScoped<IEnrollmentService, EnrollmentService>();
builder.Services.AddScoped<IWorkoutPlanService, WorkoutPlanService>();
builder.Services.AddScoped<IClassSessionService, ClassSessionService>();
builder.Services.AddScoped<IUserProgressService, UserProgressService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Relax password requirements so any password works
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 1;
    options.Password.RequiredUniqueChars = 0;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
var jwtKey = builder.Configuration["Jwt:Key"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey))
    };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated successfully");
                return Task.CompletedTask;
            },
            OnMessageReceived = context =>
            {
                var cookieToken = context.Request.Cookies["jwt"];
                if (!string.IsNullOrWhiteSpace(cookieToken))
                {
                    context.Token = cookieToken;
                }
                else
                {
                    var authHeader = context.Request.Headers.Authorization.ToString();
                    if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                    {
                        context.Token = authHeader["Bearer ".Length..].Trim();
                    }
                }
                return Task.CompletedTask;
            }
        };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthorization();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    var roles = new[] { "Member", "Admin", "Trainer" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    async Task EnsureUserAsync(string email, string password, string role)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            Console.WriteLine($"Seeding user: {email}");
            user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                FirstName = role,
                LastName = "Seed",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(user, password);
            if (!result.Succeeded) 
            {
                Console.WriteLine($"Failed to seed user {email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                return;
            }
        }
        else
        {
            Console.WriteLine($"User {email} already exists. Resetting password to {password}");
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            await userManager.ResetPasswordAsync(user, token, password);
        }

        if (!await userManager.IsInRoleAsync(user, role))
        {
            await userManager.AddToRoleAsync(user, role);
        }
    }

    // Seed accounts
    if (app.Environment.IsDevelopment())
    {
        await EnsureUserAsync("admin@test.com", "Admin123!", "Admin");
        await EnsureUserAsync("trainer_admin@gmail.com", "Trainer@2024", "Trainer");

        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        if (db.ClassSessions.Count() < 3)
        {
            Console.WriteLine("Seeding trainers and classes...");
            var jw = new Trainer { Name = "John Wick", Specialization = "HIIT", BirthDate = new DateTime(1985, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
            var sc = new Trainer { Name = "Sarah Connor", Specialization = "Strength", BirthDate = new DateTime(1990, 5, 20, 0, 0, 0, DateTimeKind.Utc) };
            
            db.Trainers.AddRange(jw, sc);
            await db.SaveChangesAsync();

            var yoga = new GymClass { Title = "Morning Yoga", DurationInMinutes = 60, TrainerId = jw.Id };
            var hiit = new GymClass { Title = "Power HIIT", DurationInMinutes = 45, TrainerId = sc.Id };
            
            db.GymClasses.AddRange(yoga, hiit);
            await db.SaveChangesAsync();

            Console.WriteLine("Seeding sessions...");
            db.ClassSessions.AddRange(
                new ClassSession { 
                    GymClassId = yoga.Id, 
                    SessionDate = DateTime.UtcNow.AddDays(1).Date, 
                    StartTime = "08:00", 
                    EndTime = "09:00", 
                    Location = "Studio A", 
                    MaxCapacity = 20 
                },
                new ClassSession { 
                    GymClassId = hiit.Id, 
                    SessionDate = DateTime.UtcNow.AddDays(2).Date, 
                    StartTime = "18:00", 
                    EndTime = "18:45", 
                    Location = "Main Floor", 
                    MaxCapacity = 15 
                },
                new ClassSession { 
                    GymClassId = yoga.Id, 
                    SessionDate = DateTime.UtcNow.AddDays(3).Date, 
                    StartTime = "10:00", 
                    EndTime = "11:00", 
                    Location = "Studio B", 
                    MaxCapacity = 25 
                },
                new ClassSession { 
                    GymClassId = hiit.Id, 
                    SessionDate = DateTime.UtcNow.AddDays(1).Date, 
                    StartTime = "17:00", 
                    EndTime = "17:45", 
                    Location = "Main Floor", 
                    MaxCapacity = 20 
                }
            );
            await db.SaveChangesAsync();
            Console.WriteLine("Database seeded successfully.");
        }
    }
}

app.Run();
