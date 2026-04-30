namespace Cars24.API.Models
{
    public class PricingRule
    {
        public int Id { get; set; }
        public string CarType { get; set; } = string.Empty; // e.g., "SUV", "Hatchback", "Sedan"
        public string Region { get; set; } = string.Empty;  // e.g., "Mumbai", "New Delhi", "All"
        public string Season { get; set; } = string.Empty;  // e.g., "Monsoon", "Fuel Spike", "All"
        public double Multiplier { get; set; }              // e.g., 1.10 (10% increase), 0.90 (10% decrease)
        public string Reason { get; set; } = string.Empty;  // Reason text for frontend UI
    }
}
