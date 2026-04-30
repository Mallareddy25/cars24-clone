using System;

namespace Cars24.API.Models
{
    public class SellLead
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public int Mileage { get; set; } // Odometer reading
        public string City { get; set; } = string.Empty;
        public decimal ExpectedPrice { get; set; }
        public string Status { get; set; } = "Pending";
        public string ImagePath { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
