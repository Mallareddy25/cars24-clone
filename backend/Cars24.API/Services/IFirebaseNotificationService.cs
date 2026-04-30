using System.Threading.Tasks;

namespace Cars24.API.Services
{
    public interface IFirebaseNotificationService
    {
        Task<bool> SendPushNotificationAsync(string fcmToken, string title, string body, string type);
    }
}
