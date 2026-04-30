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

// Initialize Firebase (wrapped in try-catch for dummy key usage)
try
{
    FirebaseApp.Create(new AppOptions()
    {
        Credential = GoogleCredential.FromFile("firebase-key.json")
    });
}
catch (Exception ex)
{
    Console.WriteLine($"[WARNING] Firebase failed to initialize with dummy key: {ex.Message}");
}

// Configure CORS to allow Next.js frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure Entity Framework Core with SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseCors("AllowNextJs");

app.UseAuthorization();

app.MapControllers();

app.Run();
