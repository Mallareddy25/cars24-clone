using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cars24.API.Migrations
{
    /// <inheritdoc />
    public partial class AddSellLeadImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "SellLeads",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "SellLeads");
        }
    }
}
