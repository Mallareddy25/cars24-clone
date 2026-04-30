namespace Cars24.API.Models
{
    public class ReferralCode
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Code { get; set; } = string.Empty;
        public int TotalReferrals { get; set; } = 0;
        public int TotalPointsEarned { get; set; } = 0;
    }
}
