namespace Cars24.API.Models
{
    public class MaintenanceCost
    {
        public int Id { get; set; }
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty; // Use "All" as a wildcard
        public int BaseMonthlyEstimate { get; set; }
        public int MajorServiceIntervalKm { get; set; }
    }
}
