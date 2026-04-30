using System;

namespace Cars24.API.Models
{
    public class Wallet
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int Balance { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
