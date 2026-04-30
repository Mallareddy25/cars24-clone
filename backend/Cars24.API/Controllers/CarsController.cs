using Cars24.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cars24.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CarsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(
            [FromQuery] string? query,
            [FromQuery] string? fuelType,
            [FromQuery] int? minMileage,
            [FromQuery] int? maxMileage,
            [FromQuery] int? minYear,
            [FromQuery] int? maxYear,
            [FromQuery] string? transmission,
            [FromQuery] string? city,
            [FromQuery] double? lat,
            [FromQuery] double? lng,
            [FromQuery] double radiusKm = 5000)
        {
            var carsQuery = _context.Cars.AsQueryable();

            // Apply City Exact Match Filter (Prioritize this over GPS location if provided)
            if (!string.IsNullOrEmpty(city) && city != "All")
            {
                carsQuery = carsQuery.Where(c => c.City == city);
            }

            // Apply Basic Filters
            if (!string.IsNullOrEmpty(fuelType))
                carsQuery = carsQuery.Where(c => c.FuelType == fuelType);
            
            if (minMileage.HasValue)
                carsQuery = carsQuery.Where(c => c.Mileage >= minMileage.Value);
            
            if (maxMileage.HasValue)
                carsQuery = carsQuery.Where(c => c.Mileage <= maxMileage.Value);
            
            if (minYear.HasValue)
                carsQuery = carsQuery.Where(c => c.Year >= minYear.Value);
            
            if (maxYear.HasValue)
                carsQuery = carsQuery.Where(c => c.Year <= maxYear.Value);
            
            if (!string.IsNullOrEmpty(transmission))
                carsQuery = carsQuery.Where(c => c.Transmission == transmission);

            var cars = await carsQuery.ToListAsync();

            // Apply Geo-fencing only if a city filter was NOT explicitly selected
            if (string.IsNullOrEmpty(city) && lat.HasValue && lng.HasValue)
            {
                cars = cars.Where(c => CalculateDistance(lat.Value, lng.Value, c.Latitude, c.Longitude) <= radiusKm).ToList();
            }

            // Apply Fuzzy Matching & Scoring In-Memory (for demo/simplicity)
            var results = cars.Select(c => new
            {
                Car = c,
                Score = CalculateRelevanceScore(c, query)
            });

            // If query is provided, filter out cars with zero score
            if (!string.IsNullOrWhiteSpace(query))
            {
                results = results.Where(r => r.Score > 0);
            }

            // Order by relevance score and then by popularity
            var rankedResults = results
                .OrderByDescending(r => r.Score)
                .ThenByDescending(r => r.Car.PopularityScore)
                .Select(r => r.Car)
                .ToList();

            return Ok(rankedResults);
        }

        [HttpGet("top-selling")]
        public async Task<IActionResult> GetTopSellingCars()
        {
            var cars = await _context.Cars.OrderByDescending(c => c.PopularityScore).Take(4).ToListAsync();
            return Ok(cars);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null) return NotFound();
            return Ok(car);
        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var R = 6371d; // Radius of the earth in km
            var dLat = Deg2Rad(lat2 - lat1);
            var dLon = Deg2Rad(lon2 - lon1); 
            var a = 
                Math.Sin(dLat / 2d) * Math.Sin(dLat / 2d) +
                Math.Cos(Deg2Rad(lat1)) * Math.Cos(Deg2Rad(lat2)) * 
                Math.Sin(dLon / 2d) * Math.Sin(dLon / 2d); 
            var c = 2d * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1d - a)); 
            return R * c;
        }

        private double Deg2Rad(double deg)
        {
            return deg * (Math.PI / 180d);
        }

        private int CalculateRelevanceScore(Models.Car car, string? query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return 1; // Default score if no query

            int score = 0;
            var q = query.ToLower();
            
            // Exact Matches
            if (car.Name.ToLower() == q || car.Brand.ToLower() == q)
                score += 100;
            
            // Contains
            if (car.Name.ToLower().Contains(q) || car.Brand.ToLower().Contains(q))
                score += 50;

            // Simple Fuzzy Match
            var queryWords = q.Split(' ');
            foreach (var word in queryWords)
            {
                if (car.Name.ToLower().Contains(word)) score += 10;
                if (car.Brand.ToLower().Contains(word)) score += 10;
            }

            return score;
        }
    }
}
