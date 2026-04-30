using System;

namespace Cars24.API.Models
{
    public class MaintenanceInsight
    {
        public int Id { get; set; }
        public int CarId { get; set; }
        public string ConditionTag { get; set; } = string.Empty;
        public int EstimatedMonthlyCost { get; set; }
        public string Insights { get; set; } = string.Empty; // Store JSON array of strings
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}
