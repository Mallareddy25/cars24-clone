using Cars24.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Cars24.API.Services
{
    public class PricingService : IPricingService
    {
        private readonly ApplicationDbContext _context;

        public PricingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PricingResult> CalculatePriceAsync(int carId, string currentSeason)
        {
            var car = await _context.Cars.FindAsync(carId);
            if (car == null) throw new Exception("Car not found");

            // Categorize the car based on name/brand to match the rules
            // In a real app, 'CarType' would be a field on the Car model.
            // For now, we will infer it for our dummy data:
            string carType = InferCarType(car);

            // Fetch pricing rules that match this car's type and region, and the current season
            // Order of precedence: Exact Season match > All Seasons. Exact Region match > All Regions.
            var rules = await _context.PricingRules
                .Where(r => 
                    (r.CarType == carType || r.CarType == "All") &&
                    (r.Region == car.City || r.Region == "All") &&
                    (r.Season == currentSeason || r.Season == "All"))
                .ToListAsync();

            // Default to no multiplier
            double finalMultiplier = 1.0;
            string finalReason = "Standard market pricing for this vehicle.";

            // Find the most specific rule if any apply
            if (rules.Any())
            {
                // Prefer exact season over "All", then prefer exact region over "All"
                var bestRule = rules
                    .OrderByDescending(r => r.Season == currentSeason ? 1 : 0)
                    .ThenByDescending(r => r.Region == car.City ? 1 : 0)
                    .First();

                finalMultiplier = bestRule.Multiplier;
                finalReason = bestRule.Reason;
            }

            return new PricingResult
            {
                BasePrice = (double)car.Price,
                Multiplier = finalMultiplier,
                RecommendedPrice = Math.Round((double)car.Price * finalMultiplier, 0),
                Reason = finalReason
            };
        }

        private string InferCarType(Models.Car car)
        {
            var name = car.Name.ToLower();
            if (name.Contains("creta") || name.Contains("thar") || name.Contains("nexon")) return "SUV";
            if (name.Contains("dzire") || name.Contains("city")) return "Sedan";
            if (name.Contains("baleno")) return "Hatchback";
            if (car.FuelType.ToLower() == "electric") return "Electric";
            return "Hatchback"; // Default fallback
        }
    }
}
