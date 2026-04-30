using Cars24.API.Data;
using Cars24.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using System.IO;
using System;

namespace Cars24.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SellController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SellController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitLead([FromForm] SellLeadRequest req)
        {
            string imagePath = string.Empty;
            if (req.Image != null && req.Image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "../../frontend/public/images/uploads");
                Directory.CreateDirectory(uploadsFolder);
                
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(req.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await req.Image.CopyToAsync(fileStream);
                }
                
                imagePath = "/images/uploads/" + uniqueFileName;
            }

            var lead = new SellLead
            {
                UserId = req.UserId,
                Brand = req.Brand,
                Model = req.Model,
                Year = req.Year,
                Mileage = req.Mileage,
                City = req.City,
                ExpectedPrice = req.ExpectedPrice,
                Status = "Pending",
                ImagePath = imagePath
            };

            _context.SellLeads.Add(lead);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, leadId = lead.Id, imagePath });
        }
    }

    public class SellLeadRequest
    {
        public int UserId { get; set; }
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public int Mileage { get; set; }
        public string City { get; set; } = string.Empty;
        public decimal ExpectedPrice { get; set; }
        public IFormFile? Image { get; set; }
    }
}
