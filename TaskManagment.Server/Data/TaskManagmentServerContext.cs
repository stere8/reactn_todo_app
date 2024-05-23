using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TaskManagment.Server.Models;

namespace TaskManagment.Server.Data
{
    public class TaskManagmentServerContext : DbContext
    {
        public TaskManagmentServerContext (DbContextOptions<TaskManagmentServerContext> options)
            : base(options)
        {
        }

        public DbSet<TaskManagment.Server.Models.User> User { get; set; } = default!;
    }
}
