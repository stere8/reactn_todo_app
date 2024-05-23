using Microsoft.EntityFrameworkCore;

namespace TaskManagment.Server.Models
{
    public class TaskManagmentDbContext : DbContext
    {
        public TaskManagmentDbContext(DbContextOptions<TaskManagmentDbContext> options) : base(options)
        {
        }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
