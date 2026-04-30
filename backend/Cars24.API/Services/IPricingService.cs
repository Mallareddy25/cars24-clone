using Cars24.API.Models;

namespace Cars24.API.Services
{
    public interface IPricingService
    {
        Task<PricingResult> CalculatePriceAsync(int carId, string currentSeason);
    }

    public class PricingResult
    {
        public double BasePrice { get; set; }
        public double RecommendedPrice { get; set; }
        public double Multiplier { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
