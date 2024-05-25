using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagment.Server.Data;
using TaskManagment.Server.DTOs;
using TaskManagment.Server.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace TaskManagment.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly TaskManagmentServerContext _context;

        public UsersController(TaskManagmentServerContext context)
        {
            _context = context;
        }

        // GET: api/Users - Retrieves a list of all users.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUser()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/{id} - Retrieves a specific user by ID.
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/{id} - Updates a specific user's information.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users - Creates a new user (could be used for admin-level user creation).
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/{id} - Deletes a specific user by ID.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Users/register - Registers a new user (user self-registration).
        [HttpPost("register")]
        public async Task<ActionResult<User>> RegisterUser(RegisterUserDto registerUserDto)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Username == registerUserDto.Username))
                {
                    return BadRequest("Username is already taken.");
                }

                if (await _context.Users.AnyAsync(u => u.Email == registerUserDto.Email))
                {
                    return BadRequest("Email is already taken.");
                }

                CreatePasswordHash(registerUserDto.Password, out string passwordHash);

                var user = new User
                {
                    Username = registerUserDto.Username,
                    Email = registerUserDto.Email,
                    PasswordHash = passwordHash
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUser", new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                // Log the exception (ex) here as needed
                return StatusCode(500, "An error occurred while registering the user.");
            }
        }

        // POST: api/Users/login - Authenticates a user (user login).
        [HttpPost("login")]
        public async Task<ActionResult<User>> LoginUser(LoginUserDto loginUserDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginUserDto.Username);

                if (user == null || !VerifyPassword(loginUserDto.Password, user.PasswordHash))
                {
                    return Unauthorized("Invalid username or password.");
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                // Log the exception (ex) here as needed
                return StatusCode(500, "An error occurred while logging in.");
            }
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        public static void CreatePasswordHash(string password, out string passwordHash)
        {
            passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
        }

        public static bool VerifyPassword(string password, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, storedHash);
        }
    }
}
