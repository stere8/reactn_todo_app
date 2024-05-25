﻿using System.ComponentModel.DataAnnotations;

namespace TaskManagment.Server.DTOs
{
    public class LoginUserDto
    {
        [Required]
        [StringLength(255)]
        public string Username { get; set; }

        [Required]
        [StringLength(255)]
        public string Password { get; set; }
    }
}