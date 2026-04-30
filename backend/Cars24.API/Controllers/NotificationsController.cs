using Cars24.API.Data;
using Cars24.API.Models;
using Cars24.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;

namespace Cars24.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IFirebaseNotificationService _firebaseService;
        private readonly int MockUserId = 1; // Assuming a single user for demo

        public NotificationsController(ApplicationDbContext context, IFirebaseNotificationService firebaseService)
        {
            _context = context;
            _firebaseService = firebaseService;
        }

        // POST: /api/notifications/send
        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] SendNotificationDto dto)
        {
            var prefs = await _context.UserNotificationPreferences.FirstOrDefaultAsync(u => u.UserId == MockUserId);
            if (prefs == null) return BadRequest("User preferences not found");

            // Check if user wants this type of alert
            bool shouldSend = dto.Type switch
            {
                "Appointment" => prefs.AppointmentAlerts,
                "Bid" => prefs.BidAlerts,
                "PriceDrop" => prefs.PriceAlerts,
                "Message" => prefs.MessageAlerts,
                _ => false
            };

            if (!shouldSend) return Ok("Notification skipped due to user preferences.");

            // Save notification to DB
            var notification = new Notification
            {
                UserId = MockUserId,
                Type = dto.Type,
                Message = dto.Message
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Send push notification if FCM token exists and channel allows browser
            if (!string.IsNullOrEmpty(prefs.FcmToken) && (prefs.Channel == "browser" || prefs.Channel == "both"))
            {
                string title = $"New {dto.Type} Alert";
                await _firebaseService.SendPushNotificationAsync(prefs.FcmToken, title, dto.Message, dto.Type);
            }

            return Ok(new { success = true, notification });
        }

        // POST: /api/notifications/token
        [HttpPost("token")]
        public async Task<IActionResult> SaveToken([FromBody] TokenDto dto)
        {
            var prefs = await _context.UserNotificationPreferences.FirstOrDefaultAsync(u => u.UserId == MockUserId);
            if (prefs != null)
            {
                prefs.FcmToken = dto.Token;
                await _context.SaveChangesAsync();
            }
            return Ok();
        }

        // GET: /api/notifications/preferences
        [HttpGet("preferences")]
        public async Task<IActionResult> GetPreferences()
        {
            var prefs = await _context.UserNotificationPreferences.FirstOrDefaultAsync(u => u.UserId == MockUserId);
            if (prefs == null) return NotFound();
            return Ok(prefs);
        }

        // PUT: /api/notifications/preferences
        [HttpPut("preferences")]
        public async Task<IActionResult> UpdatePreferences([FromBody] UserNotificationPreference newPrefs)
        {
            var prefs = await _context.UserNotificationPreferences.FirstOrDefaultAsync(u => u.UserId == MockUserId);
            if (prefs == null) return NotFound();

            prefs.AppointmentAlerts = newPrefs.AppointmentAlerts;
            prefs.BidAlerts = newPrefs.BidAlerts;
            prefs.PriceAlerts = newPrefs.PriceAlerts;
            prefs.MessageAlerts = newPrefs.MessageAlerts;
            prefs.Channel = newPrefs.Channel;

            await _context.SaveChangesAsync();
            return Ok(prefs);
        }
    }

    public class SendNotificationDto
    {
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class TokenDto
    {
        public string Token { get; set; } = string.Empty;
    }
}
