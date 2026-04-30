using Cars24.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PricingController : ControllerBase
    {
        private readonly IPricingService _pricingService;

        public PricingController(IPricingService pricingService)
        {
            _pricingService = pricingService;
        }

        [HttpGet("{carId}")]
        public async Task<IActionResult> GetPrice(int carId, [FromQuery] string season = "All")
        {
            try
            {
                // In a real app, 'season' might be calculated from DateTime.Now.
                // We accept it as a query param to allow the frontend to toggle it for demonstration purposes.
                var result = await _pricingService.CalculatePriceAsync(carId, season);
                return Ok(result);
            }
            catch (Exception ex)
            {
                if (ex.Message == "Car not found") return NotFound();
                return StatusCode(500, ex.Message);
            }
        }
    }
}
