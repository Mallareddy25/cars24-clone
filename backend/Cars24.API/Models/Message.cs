using System;

namespace Cars24.API.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int CarId { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
