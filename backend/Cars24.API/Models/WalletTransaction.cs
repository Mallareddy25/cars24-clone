using System;

namespace Cars24.API.Models
{
    public class WalletTransaction
    {
        public int Id { get; set; }
        public int WalletId { get; set; }
        public string Type { get; set; } = string.Empty; // "Earned", "Redeemed"
        public int Points { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
