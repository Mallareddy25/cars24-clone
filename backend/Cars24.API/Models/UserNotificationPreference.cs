namespace Cars24.API.Models
{
    public class UserNotificationPreference
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public bool AppointmentAlerts { get; set; } = true;
        public bool BidAlerts { get; set; } = true;
        public bool PriceAlerts { get; set; } = true;
        public bool MessageAlerts { get; set; } = true;
        public string Channel { get; set; } = "browser"; // "browser", "email", "both"
        public string? FcmToken { get; set; } // Firebase Cloud Messaging Token
    }
}
