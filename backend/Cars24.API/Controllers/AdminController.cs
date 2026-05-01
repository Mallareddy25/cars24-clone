using Cars24.API.Data;
using Cars24.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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
                        new Car { Brand = "Maruti", Name = "Swift DZire", Year = 2021, Price = 650000, FuelType = "Petrol", Transmission = "Manual", Mileage = 22, City = "Hyderabad", Latitude = 17.3850, Longitude = 78.4867, PopularityScore = 90 },
                        new Car { Brand = "Honda", Name = "City", Year = 2022, Price = 1250000, FuelType = "Petrol", Transmission = "Automatic", Mileage = 18, City = "Bangalore", Latitude = 12.9716, Longitude = 77.5946, PopularityScore = 85 },
                        new Car { Brand = "Hyundai", Name = "Creta", Year = 2023, Price = 1500000, FuelType = "Diesel", Transmission = "Automatic", Mileage = 17, City = "Mumbai", Latitude = 19.0760, Longitude = 72.8777, PopularityScore = 95 },
                        new Car { Brand = "Tata", Name = "Nexon", Year = 2022, Price = 950000, FuelType = "EV", Transmission = "Automatic", Mileage = 312, City = "Delhi", Latitude = 28.6139, Longitude = 77.2090, PopularityScore = 88 },
                        new Car { Brand = "Mahindra", Name = "Thar", Year = 2023, Price = 1650000, FuelType = "Diesel", Transmission = "Manual", Mileage = 15, City = "Pune", Latitude = 18.5204, Longitude = 73.8567, PopularityScore = 80 },
                        new Car { Brand = "Maruti", Name = "Baleno", Year = 2022, Price = 780000, FuelType = "Petrol", Transmission = "Automatic", Mileage = 21, City = "Hyderabad", Latitude = 17.4239, Longitude = 78.4738, PopularityScore = 75 },
                        new Car { Brand = "Toyota", Name = "Innova", Year = 2021, Price = 1850000, FuelType = "Diesel", Transmission = "Manual", Mileage = 14, City = "Chennai", Latitude = 13.0827, Longitude = 80.2707, PopularityScore = 82 },
                        new Car { Brand = "Kia", Name = "Seltos", Year = 2023, Price = 1350000, FuelType = "Petrol", Transmission = "Automatic", Mileage = 16, City = "Delhi", Latitude = 28.5355, Longitude = 77.3910, PopularityScore = 78 }
                    };

                    _context.Cars.AddRange(dummyCars);
                    await _context.SaveChangesAsync();
                    return Ok("✅ Database seeded with 8 dummy cars across Indian cities!");
                }

                return Ok("ℹ️ Database already exists and has data.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"❌ Error: {ex.Message}");
            }
        }

        // Force reseed - deletes old cars and adds fresh ones with proper GPS + multiple per city
        [HttpGet("reseed")]
        public async Task<IActionResult> ReseedCars()
        {
            try
            {
                // Remove all existing cars
                var existing = _context.Cars.ToList();
                _context.Cars.RemoveRange(existing);
                await _context.SaveChangesAsync();

                var cars = new List<Car>
                {
                    // Hyderabad (2 cars)
                    new Car { Brand = "Maruti", Name = "Swift DZire", Year = 2021, Price = 650000, FuelType = "Petrol", Transmission = "Manual", Mileage = 22, City = "Hyderabad", Latitude = 17.3850, Longitude = 78.4867, PopularityScore = 90 },
                    new Car { Brand = "Maruti", Name = "Baleno", Year = 2022, Price = 780000, FuelType = "Petrol", Transmission = "Automatic", Mileage = 21, City = "Hyderabad", Latitude = 17.4239, Longitude = 78.4738, PopularityScore = 75 },
                    // Bangalore (2 cars)
                    new Car { Brand = "Honda", Name = "City", Year = 2022, Price = 1250000, FuelType = "Petrol", Transmission = "Automatic", Mileage = 18, City = "Bangalore", Latitude = 12.9716, Longitude = 77.5946, PopularityScore = 85 },
                    new Car { Brand = "Kia", Name = "Sonet", Year = 2023, Price = 1100000, FuelType = "Diesel", Transmission = "Automatic", Mileage = 19, City = "Bangalore", Latitude = 12.9352, Longitude = 77.6245, PopularityScore = 72 },
                    // Mumbai (2 cars)
                    new Car { Brand = "Hyundai", Name = "Creta", Year = 2023, Price = 1500000, FuelType = "Diesel", Transmission = "Automatic", Mileage = 17, City = "Mumbai", Latitude = 19.0760, Longitude = 72.8777, PopularityScore = 95 },
                    new Car { Brand = "Toyota", Name = "Fortuner", Year = 2022, Price = 3200000, FuelType = "Diesel", Transmission = "Automatic", Mileage = 12, City = "Mumbai", Latitude = 19.1136, Longitude = 72.8697, PopularityScore = 88 },
                    // Delhi (2 cars)
                    new Car { Brand = "Tata", Name = "Nexon", Year = 2022, Price = 950000, FuelType = "EV", Transmission = "Automatic", Mileage = 312, City = "Delhi", Latitude = 28.6139, Longitude = 77.2090, PopularityScore = 88 },
                    new Car { Brand = "Kia", Name = "Seltos", Year = 2023, Price = 1350000, FuelType = "Petrol", Transmission = "Automatic", Mileage = 16, City = "Delhi", Latitude = 28.5355, Longitude = 77.3910, PopularityScore = 78 },
                    // Pune (2 cars)
                    new Car { Brand = "Mahindra", Name = "Thar", Year = 2023, Price = 1650000, FuelType = "Diesel", Transmission = "Manual", Mileage = 15, City = "Pune", Latitude = 18.5204, Longitude = 73.8567, PopularityScore = 80 },
                    new Car { Brand = "Hyundai", Name = "i20", Year = 2022, Price = 880000, FuelType = "Petrol", Transmission = "Manual", Mileage = 20, City = "Pune", Latitude = 18.5642, Longitude = 73.7769, PopularityScore = 70 },
                    // Chennai (2 cars)
                    new Car { Brand = "Toyota", Name = "Innova", Year = 2021, Price = 1850000, FuelType = "Diesel", Transmission = "Manual", Mileage = 14, City = "Chennai", Latitude = 13.0827, Longitude = 80.2707, PopularityScore = 82 },
                    new Car { Brand = "Tata", Name = "Harrier", Year = 2023, Price = 1750000, FuelType = "Diesel", Transmission = "Automatic", Mileage = 15, City = "Chennai", Latitude = 13.0569, Longitude = 80.2425, PopularityScore = 76 },
                };

                _context.Cars.AddRange(cars);
                await _context.SaveChangesAsync();

                return Ok($"✅ Reseeded with {cars.Count} cars across 6 Indian cities (2 per city)!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"❌ Error: {ex.Message}");
            }
        }

        [HttpPost("approve-lead/{leadId}")]
        public async Task<IActionResult> ApproveLead(int leadId)
        {
            try
            {
                var lead = await _context.SellLeads.FindAsync(leadId);
                if (lead == null) return NotFound("Lead not found.");

                // Promote the sell lead into the Cars inventory
                var car = new Cars24.API.Models.Car
                {
                    Brand = lead.Brand,
                    Name = lead.Model,
                    Year = lead.Year,
                    Price = (long)lead.ExpectedPrice,
                    Mileage = lead.Mileage,
                    City = lead.City,
                    FuelType = "Petrol", // default
                    Transmission = "Manual", // default
                    PopularityScore = 50
                };

                _context.Cars.Add(car);
                lead.Status = "Approved";
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = $"Lead approved! Car '{car.Brand} {car.Name}' is now live on the homepage.", carId = car.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
