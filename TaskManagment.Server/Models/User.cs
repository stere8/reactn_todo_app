using System.ComponentModel.DataAnnotations;

namespace TaskManagment.Server.Models
{
    public class User
    {
        public int Id { get; set; } // Primary key

        [Required]
        [StringLength(255)]
        [ServiceStack.DataAnnotations.Unique] // Specify data annotation for unique constraint
        public string Username { get; set; }

        [Required]
        [StringLength(255)]
        [ServiceStack.DataAnnotations.UniqueAttribute]  // Ensure unique email addresses
        public string Email { get; set; }

        [Required]
        [StringLength(64)]  // Assuming a fixed-length hashed password
        public string PasswordHash { get; set; }

        [Required]
        [StringLength(24)]  // Assuming a fixed-length salt
        public string Salt { get; set; }

        public List<Task> Tasks { get; set; } // Navigation property for tasks owned by the user
    }

}
