using Cars24.API.Data;
using Cars24.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace Cars24.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MaintenanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("estimate")]
        public async Task<IActionResult> EstimateMaintenance([FromBody] MaintenanceEstimateRequest req)
        {
            // Fetch base costs
            var baseCost = await _context.MaintenanceCosts
                .FirstOrDefaultAsync(m => m.Brand == req.Brand && (m.Model == req.Model || m.Model == "All"));

            if (baseCost == null)
            {
                baseCost = await _context.MaintenanceCosts.FirstOrDefaultAsync(m => m.Brand == "Default");
            }

            if (baseCost == null) return StatusCode(500, "Base maintenance costs not found.");

            int estimatedCost = baseCost.BaseMonthlyEstimate;
            string conditionTag = "Standard Maintenance";
            List<string> insights = new List<string>();

            bool isOld = req.Age > 5;
            bool isHighMileage = req.KmDriven > 80000;

            if (isOld && isHighMileage)
            {
                estimatedCost = (int)(estimatedCost * 1.7); // +70%
                conditionTag = "High Maintenance Expected";
                insights.Add("Vehicle is both older than 5 years and has high mileage. Prepare for major wear-and-tear repairs.");
            }
            else if (isHighMileage)
            {
                estimatedCost = (int)(estimatedCost * 1.4); // +40%
                conditionTag = "Elevated Maintenance (Mileage)";
                insights.Add("High mileage detected. Suspension components and timing belt should be inspected immediately.");
            }
            else if (isOld)
            {
                estimatedCost = (int)(estimatedCost * 1.3); // +30%
                conditionTag = "Elevated Maintenance (Age)";
                insights.Add("Vehicle is older than 5 years. Rubber components (hoses, belts) are prone to degradation.");
            }
            else
            {
                insights.Add("Vehicle is relatively new with low mileage. Stick to regular oil changes and fluid top-ups.");
            }

            // Next service interval calculation
            int nextServiceAt = ((req.KmDriven / baseCost.MajorServiceIntervalKm) + 1) * baseCost.MajorServiceIntervalKm;
            int kmUntilNextService = nextServiceAt - req.KmDriven;
            insights.Add($"Next major service due in {kmUntilNextService:N0} km (at {nextServiceAt:N0} km).");

            if (req.KmDriven > 40000 && req.KmDriven < 50000)
            {
                insights.Add("Brake pads likely need replacement soon based on average wear patterns.");
            }
            else if (req.KmDriven > 30000 && req.KmDriven < 40000)
            {
                insights.Add("Tire replacement expected soon based on current mileage.");
            }

            // Log Insight
            var insightRecord = new MaintenanceInsight
            {
                CarId = req.CarId,
                ConditionTag = conditionTag,
                EstimatedMonthlyCost = estimatedCost,
                Insights = JsonSerializer.Serialize(insights)
            };
            
            _context.MaintenanceInsights.Add(insightRecord);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                baseCost = baseCost.BaseMonthlyEstimate,
                estimatedMonthlyCost = estimatedCost,
                conditionTag,
                insights
            });
        }
    }

    public class MaintenanceEstimateRequest
    {
        public int CarId { get; set; }
        public int Age { get; set; }
        public int KmDriven { get; set; }
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
    }
}
