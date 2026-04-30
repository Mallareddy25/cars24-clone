using Cars24.API.Data;
using Cars24.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Cars24.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReferralController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReferralController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /api/referral/{userId}
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetReferralCode(int userId)
        {
            if (Request.Headers.TryGetValue("x-user-id", out var headerUserId) && int.TryParse(headerUserId, out int parsedId))
            {
                userId = parsedId;
            }

            var referralCode = await _context.ReferralCodes.FirstOrDefaultAsync(r => r.UserId == userId);
            
            // Auto-generate if missing (simulating generation on register)
            if (referralCode == null) 
            {
                var randomCode = "CARS24-" + System.Guid.NewGuid().ToString().Substring(0, 6).ToUpper();
                referralCode = new ReferralCode
                {
                    UserId = userId,
                    Code = randomCode,
                    TotalReferrals = 0,
                    TotalPointsEarned = 0
                };
                _context.ReferralCodes.Add(referralCode);
                await _context.SaveChangesAsync();
            }

            return Ok(referralCode);
        }

        // POST: /api/referral/apply
        [HttpPost("apply")]
        public async Task<IActionResult> ApplyReferralCode([FromBody] ApplyReferralRequest req)
        {
            var refCode = await _context.ReferralCodes.FirstOrDefaultAsync(r => r.Code == req.Code);
            if (refCode == null) return BadRequest("Invalid referral code.");

            if (refCode.UserId == req.ReferredUserId) return BadRequest("You cannot use your own referral code.");

            // 1. Give Welcome Points to the referred user (e.g. 500 points)
            var referredUserWallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == req.ReferredUserId);
            if (referredUserWallet == null)
            {
                // Create wallet if it doesn't exist
                referredUserWallet = new Wallet { UserId = req.ReferredUserId, Balance = 0 };
                _context.Wallets.Add(referredUserWallet);
                await _context.SaveChangesAsync(); // Save to get the ID
            }

            referredUserWallet.Balance += 500;
            _context.WalletTransactions.Add(new WalletTransaction
            {
                WalletId = referredUserWallet.Id,
                Type = "Earned",
                Points = 500,
                Description = $"Welcome bonus for using referral code {req.Code}"
            });

            // 2. Give Referral Bonus to the referrer (e.g. 1000 points)
            var referrerWallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == refCode.UserId);
            if (referrerWallet != null)
            {
                referrerWallet.Balance += 1000;
                _context.WalletTransactions.Add(new WalletTransaction
                {
                    WalletId = referrerWallet.Id,
                    Type = "Earned",
                    Points = 1000,
                    Description = $"Referral bonus for referring a new user."
                });

                // Update Referrer stats
                refCode.TotalReferrals += 1;
                refCode.TotalPointsEarned += 1000;
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Referral code applied successfully! 500 points added to your wallet." });
        }
    }

    public class ApplyReferralRequest
    {
        public string Code { get; set; } = string.Empty;
        public int ReferredUserId { get; set; }
    }
}
