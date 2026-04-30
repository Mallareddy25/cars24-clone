using Cars24.API.Data;
using Cars24.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Cars24.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest("Email and Password are required.");

            if (await _context.Users.AnyAsync(u => u.Email == req.Email))
                return BadRequest("Email is already registered.");

            var newUser = new User
            {
                Name = req.Name,
                Email = req.Email,
                PasswordHash = req.Password // Simplistic unhashed storage for demo
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            // Auto-create a wallet for new user with 500 points
            var newWallet = new Wallet { UserId = newUser.Id, Balance = 500 };
            _context.Wallets.Add(newWallet);
            await _context.SaveChangesAsync();
            
            _context.WalletTransactions.Add(new WalletTransaction
            {
                WalletId = newWallet.Id,
                Type = "CREDIT",
                Points = 500,
                Description = "Welcome Bonus!"
            });
            await _context.SaveChangesAsync();

            return Ok(new { success = true, user = new { id = newUser.Id, name = newUser.Name, email = newUser.Email } });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email && u.PasswordHash == req.Password);
            if (user == null)
                return Unauthorized("Invalid credentials.");

            return Ok(new { success = true, user = new { id = user.Id, name = user.Name, email = user.Email } });
        }
    }

    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
