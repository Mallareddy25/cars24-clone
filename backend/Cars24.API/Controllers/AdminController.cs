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
                
                // Add dummy cars if inventory is empty
                if (!await _context.Cars.AnyAsync())
                {
                    var dummyCars = new List<Car>
                    {
                        new Car { Brand = "Maruti", Name = "Swift DZire", Year = 2021, Price = 650000, FuelType = "Petrol", Transmission = "Manual", Mileage = 22, City = "Hyderabad" },
                        new Car { Brand = "Honda", Name = "City", Year = 2022, Price = 1250000, FuelType = "Petrol", Transmission = "Automatic", Mileage = 18, City = "Bangalore" },
                        new Car { Brand = "Hyundai", Name = "Creta", Year = 2023, Price = 1500000, FuelType = "Diesel", Transmission = "Automatic", Mileage = 17, City = "Mumbai" },
                        new Car { Brand = "Tata", Name = "Nexon", Year = 2022, Price = 950000, FuelType = "EV", Transmission = "Automatic", Mileage = 312, City = "Delhi" },
                        new Car { Brand = "Mahindra", Name = "Thar", Year = 2023, Price = 1650000, FuelType = "Diesel", Transmission = "Manual", Mileage = 15, City = "Pune" }
                    };
                    
                    _context.Cars.AddRange(dummyCars);
                    await _context.SaveChangesAsync();
                    return Ok("✅ Database setup and seeded with dummy cars successfully!");
                }

                return Ok("ℹ️ Database already exists and has data.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"❌ Error: {ex.Message}");
            }
        }
    }
}
