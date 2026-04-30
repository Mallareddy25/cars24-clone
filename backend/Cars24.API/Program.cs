using Cars24.API.Data;
using Cars24.API.Services;
using Microsoft.EntityFrameworkCore;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<IPricingService, PricingService>();
builder.Services.AddScoped<IFirebaseNotificationService, FirebaseNotificationService>();

// Initialize Firebase (only if key file exists)
if (File.Exists("firebase-key.json"))
{
    try
    {
        FirebaseApp.Create(new AppOptions()
        {
            Credential = GoogleCredential.FromFile("firebase-key.json")
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[WARNING] Firebase failed to initialize: {ex.Message}");
    }
}
else
{
    Console.WriteLine("[INFO] firebase-key.json not found. Firebase notifications disabled.");
}

// Configure CORS to allow Next.js frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins(
                  "http://localhost:3000",
                  "https://cars24-clonee.netlify.app"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure Entity Framework Core with PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Parse Render's postgresql:// URL format to ADO.NET format if needed
if (!string.IsNullOrEmpty(connectionString) && connectionString.StartsWith("postgres"))
{
    var uri = new Uri(connectionString);
    var userInfo = uri.UserInfo.Split(':');
    
    connectionString = $"Host={uri.Host};Port={(uri.Port > 0 ? uri.Port : 5432)};Database={uri.LocalPath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SslMode=Require;TrustServerCertificate=true;";
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

// NOTE: EnsureCreated() removed - tables will be created via Render Shell

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// NOTE: Removed UseHttpsRedirection - Render handles HTTPS at the load balancer level
// app.UseHttpsRedirection();

app.UseCors("AllowNextJs");

app.UseAuthorization();

app.MapControllers();

app.Run();
