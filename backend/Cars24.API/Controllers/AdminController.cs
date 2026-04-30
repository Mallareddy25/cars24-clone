using Cars24.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Cars24.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalCars = await _context.Cars.CountAsync();
            var totalLeads = await _context.SellLeads.CountAsync();

            return Ok(new
            {
                totalUsers,
                totalCars,
                totalLeads
            });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            // Excluding PasswordHash for security
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.CreatedAt
                })
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("leads")]
        public async Task<IActionResult> GetLeads()
        {
            var leads = await _context.SellLeads
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

            return Ok(leads);
        }
        [HttpGet("setup")]
        public async Task<IActionResult> SetupDatabase()
        {
            try
            {
                var created = await _context.Database.EnsureCreatedAsync();
                if (created)
                    return Ok("✅ Database tables created successfully!");
                else
                    return Ok("ℹ️ Database tables already exist.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"❌ Error: {ex.Message}");
            }
        }
    }
}
