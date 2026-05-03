
using System.ComponentModel.DataAnnotations;

namespace GymProject.DTOs
{
    public class RegisterModelDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string HashedPassword { get; set; }
        [Required]
        [MinLength(1)]
        [MaxLength(100)]
        public string FirstName { get; set; }
        [Required]
        [MinLength(1)]
        [MaxLength(100)]
        public string LastName { get; set; }

            [Phone]
        public string? PhoneNumber { get; set; }

    }
}
