using Cars24.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Cars24.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Car> Cars { get; set; }
        public DbSet<ServiceCenter> ServiceCenters { get; set; }
        public DbSet<PickupPoint> PickupPoints { get; set; }
        public DbSet<PricingRule> PricingRules { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<UserNotificationPreference> UserNotificationPreferences { get; set; }
        public DbSet<ReferralCode> ReferralCodes { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<WalletTransaction> WalletTransactions { get; set; }
        public DbSet<MaintenanceCost> MaintenanceCosts { get; set; }
        public DbSet<MaintenanceInsight> MaintenanceInsights { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<SellLead> SellLeads { get; set; }
    }
}
