using Cars24.API.Data;
using Cars24.API.Models;
using Cars24.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Cars24.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IFirebaseNotificationService _firebaseService;
        
        // Mocking the user as Buyer (1) and Seller as (99)
        private readonly int MockBuyerId = 1;
        private readonly int MockSellerId = 99;

        public MessagesController(ApplicationDbContext context, IFirebaseNotificationService firebaseService)
        {
            _context = context;
            _firebaseService = firebaseService;
        }

        [HttpGet("{carId}")]
        public async Task<IActionResult> GetMessages(int carId)
        {
            int buyerId = MockBuyerId;
            if (Request.Headers.TryGetValue("x-user-id", out var headerUserId) && int.TryParse(headerUserId, out int parsedId))
            {
                buyerId = parsedId;
            }

            var messages = await _context.Messages
                .Where(m => m.CarId == carId && (m.SenderId == buyerId || m.ReceiverId == buyerId))
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();

            return Ok(messages);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Content)) return BadRequest("Message cannot be empty.");

            int buyerId = MockBuyerId;
            if (Request.Headers.TryGetValue("x-user-id", out var headerUserId) && int.TryParse(headerUserId, out int parsedId))
            {
                buyerId = parsedId;
            }

            // 1. Save Buyer's Message
            var userMsg = new Message
            {
                CarId = req.CarId,
                SenderId = buyerId,
                ReceiverId = MockSellerId,
                Content = req.Content
            };
            _context.Messages.Add(userMsg);
            await _context.SaveChangesAsync();

            // 2. Schedule Auto-Reply (simulated background task)
            _ = Task.Run(async () =>
            {
                await Task.Delay(2000); // Wait 2 seconds

                // Create a new scope for DbContext since the current request might have finished
                var scopeFactory = HttpContext.RequestServices.GetService(typeof(Microsoft.Extensions.DependencyInjection.IServiceScopeFactory)) as Microsoft.Extensions.DependencyInjection.IServiceScopeFactory;
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                
                var car = await db.Cars.FirstOrDefaultAsync(c => c.Id == req.CarId);
                string replyText = "";
                string lowerContent = req.Content.ToLower();
                
                if (car == null) 
                {
                    replyText = "Sorry, I can't find details for this car.";
                }
                else if (lowerContent.Contains("price") || lowerContent.Contains("cost") || lowerContent.Contains("how much") || lowerContent.Contains("negotiable"))
                {
                    replyText = $"The recommended price for this {car.Year} {car.Brand} {car.Name} is ₹{car.Price:N0}. Our prices are data-driven and non-negotiable, but let me know if you want to proceed!";
                }
                else if (lowerContent.Contains("mileage") || lowerContent.Contains("efficiency") || lowerContent.Contains("fuel") || lowerContent.Contains("kmpl"))
                {
                    replyText = $"This {car.Brand} {car.Name} runs on {car.FuelType} and gives an excellent mileage of {car.Mileage} kmpl!";
                }
                else if (lowerContent.Contains("test drive") || lowerContent.Contains("book") || lowerContent.Contains("see") || lowerContent.Contains("visit"))
                {
                    replyText = $"I can absolutely help you schedule a test drive! The car is currently located in {car.City}. What date and time works best for you this week?";
                }
                else
                {
                    replyText = $"Hi! I'm the Cars24 AI Assistant for this {car.Brand} {car.Name}. I can answer questions about its price, fuel efficiency, or help you book a test drive! What would you like to know?";
                }
                
                var sellerReply = new Message
                {
                    CarId = req.CarId,
                    SenderId = MockSellerId,
                    ReceiverId = buyerId,
                    Content = replyText
                };
                db.Messages.Add(sellerReply);
                await db.SaveChangesAsync();

                // Trigger Push Notification back to the Buyer
                var prefs = await db.UserNotificationPreferences.FirstOrDefaultAsync(u => u.UserId == buyerId);
                if (prefs != null && prefs.MessageAlerts && !string.IsNullOrEmpty(prefs.FcmToken))
                {
                    await _firebaseService.SendPushNotificationAsync(prefs.FcmToken, "New Message from Seller", sellerReply.Content, "Message");
                }
            });

            return Ok(new { success = true, message = userMsg });
        }
    }

    public class SendMessageRequest
    {
        public int CarId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
