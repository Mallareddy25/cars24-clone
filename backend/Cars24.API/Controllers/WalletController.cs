using Cars24.API.Data;
using Cars24.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;

namespace Cars24.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WalletController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WalletController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /api/wallet/{userId}
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWallet(int userId)
        {
            if (Request.Headers.TryGetValue("x-user-id", out var headerUserId) && int.TryParse(headerUserId, out int parsedId))
            {
                userId = parsedId;
            }

            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
            if (wallet == null) return NotFound("Wallet not found.");

            var transactions = await _context.WalletTransactions
                .Where(t => t.WalletId == wallet.Id)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(new
            {
                Balance = wallet.Balance,
                Transactions = transactions
            });
        }

        // POST: /api/wallet/redeem
        [HttpPost("redeem")]
        public async Task<IActionResult> RedeemPoints([FromBody] RedeemRequest req)
        {
            if (Request.Headers.TryGetValue("x-user-id", out var headerUserId) && int.TryParse(headerUserId, out int parsedId))
            {
                req.UserId = parsedId;
            }

            if (req.Points <= 0) return BadRequest("Invalid points amount.");

            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == req.UserId);
            if (wallet == null) return NotFound("Wallet not found.");

            if (wallet.Balance < req.Points)
            {
                return BadRequest("Insufficient points.");
            }

            wallet.Balance -= req.Points;

            var transaction = new WalletTransaction
            {
                WalletId = wallet.Id,
                Type = "Redeemed",
                Points = -req.Points,
                Description = $"Redeemed {req.Points} points for a discount voucher."
            };

            _context.WalletTransactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, newBalance = wallet.Balance });
        }
    }

    public class RedeemRequest
    {
        public int UserId { get; set; }
        public int Points { get; set; }
    }
}
