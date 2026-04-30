# Cars24 Clone - Full Stack Internship Project

A full-stack, responsive web application inspired by Cars24. Built to demonstrate modern web development practices, decoupled microservices architecture, and comprehensive database management.

## 🚀 Features
- **Authentication System:** User sign-up, login, and secure state management.
- **Dynamic Inventory Search:** Browse used cars with multi-parameter filtering (Brand, Price, Transmission).
- **Geospatial Queries (Geofencing):** "Use My Location" functionality that calculates distances to return only cars within a specific radius of the user's GPS coordinates.
- **Sell Your Car Workflow:** Lead generation form supporting multipart form data (image uploads).
- **Admin Dashboard:** An internal portal to monitor platform metrics, registered users, and appraisal leads.
- **Wallet & Referral System:** Users automatically receive a Welcome Bonus upon registration.

## 🛠️ Technology Stack
- **Frontend:** Next.js, React, Vanilla CSS
- **Backend API:** .NET 8 (C# ASP.NET Core Web API)
- **Database:** Microsoft SQL Server
- **ORM:** Entity Framework Core (Code-First Migrations)

## 📂 Project Structure
- `/frontend`: The Next.js application.
- `/backend`: The .NET Web API and Entity Framework Models.

## ⚙️ How to Run Locally

### 1. Database Setup
Ensure Microsoft SQL Server is running locally. Update the `ConnectionStrings` in `backend/Cars24.API/appsettings.json` with your credentials.
```bash
cd backend/Cars24.API
dotnet ef database update
```

### 2. Start the Backend API
```bash
cd backend/Cars24.API
dotnet run --urls="http://localhost:5005"
```

### 3. Start the Frontend
Open a new terminal window.
```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:3000` to view the application!
