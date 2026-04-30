using Cars24.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cars24.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LocationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("servicecenters")]
        public async Task<IActionResult> GetServiceCenters([FromQuery] string? city)
        {
            var query = _context.ServiceCenters.AsQueryable();
            if (!string.IsNullOrEmpty(city) && city.ToLower() != "all")
            {
                query = query.Where(s => s.City.ToLower() == city.ToLower());
            }
            return Ok(await query.ToListAsync());
        }

        [HttpGet("pickuppoints")]
        public async Task<IActionResult> GetPickupPoints([FromQuery] string? city)
        {
            var query = _context.PickupPoints.AsQueryable();
            if (!string.IsNullOrEmpty(city) && city.ToLower() != "all")
            {
                query = query.Where(p => p.City.ToLower() == city.ToLower());
            }
            return Ok(await query.ToListAsync());
        }
    }
}
