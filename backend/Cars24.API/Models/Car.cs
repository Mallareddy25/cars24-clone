namespace Cars24.API.Models
{
    public class Car
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string FuelType { get; set; } = string.Empty;
        public int Mileage { get; set; }
        public int Year { get; set; }
        public string Transmission { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int PopularityScore { get; set; }
        public string City { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
