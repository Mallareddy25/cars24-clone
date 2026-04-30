using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cars24.API.Migrations
{
    /// <inheritdoc />
    public partial class MaintenanceEstimator : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MaintenanceCosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Brand = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Model = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BaseMonthlyEstimate = table.Column<int>(type: "int", nullable: false),
                    MajorServiceIntervalKm = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceCosts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MaintenanceInsights",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CarId = table.Column<int>(type: "int", nullable: false),
                    ConditionTag = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EstimatedMonthlyCost = table.Column<int>(type: "int", nullable: false),
                    Insights = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GeneratedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceInsights", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MaintenanceCosts");

            migrationBuilder.DropTable(
                name: "MaintenanceInsights");
        }
    }
}
