USE Cars24Db;
GO

-- Delete old records
DELETE FROM Cars;
DELETE FROM ServiceCenters;
DELETE FROM PickupPoints;

-- Seed Cars with coordinates (Using New Delhi coordinates as base, adjusting slightly for spread)
-- New Delhi base: 28.6139, 77.2090
INSERT INTO Cars (Name, Brand, FuelType, Mileage, Year, Transmission, Price, PopularityScore, City, Latitude, Longitude)
VALUES 
('Swift DZire', 'Maruti', 'Petrol', 22, 2020, 'Manual', 650000, 95, 'New Delhi', 28.6120, 77.2100),
('City', 'Honda', 'Petrol', 18, 2021, 'Automatic', 1150000, 88, 'New Delhi', 28.6150, 77.2050),
('Creta', 'Hyundai', 'Diesel', 19, 2022, 'Automatic', 1550000, 92, 'New Delhi', 28.6180, 77.2150),
('Nexon', 'Tata', 'Electric', 0, 2023, 'Automatic', 1600000, 90, 'New Delhi', 28.6200, 77.2200),
('Baleno', 'Maruti', 'Petrol', 21, 2019, 'Manual', 580000, 85, 'Mumbai', 19.0760, 72.8777),
('Thar', 'Mahindra', 'Diesel', 15, 2023, 'Automatic', 1750000, 98, 'Mumbai', 19.0800, 72.8800);

-- Seed Service Centers
INSERT INTO ServiceCenters (Name, City, Address, Latitude, Longitude)
VALUES
('Cars24 Service Hub - Connaught Place', 'New Delhi', 'Block A, Connaught Place, New Delhi', 28.6315, 77.2167),
('Cars24 Auto Center - Saket', 'New Delhi', 'Select Citywalk Area, Saket, New Delhi', 28.5284, 77.2173),
('Cars24 Service Hub - Andheri', 'Mumbai', 'Andheri East, Mumbai', 19.1136, 72.8697);

-- Seed Pickup Points
INSERT INTO PickupPoints (Name, City, Address, Latitude, Longitude)
VALUES
('Quick Drop - India Gate', 'New Delhi', 'Near India Gate, New Delhi', 28.6129, 77.2295),
('Quick Drop - Bandra', 'Mumbai', 'Bandra West, Mumbai', 19.0596, 72.8295);

-- Seed Pricing Rules
DELETE FROM PricingRules;

INSERT INTO PricingRules (CarType, Region, Season, Multiplier, Reason)
VALUES
('SUV', 'All', 'Monsoon', 1.08, 'High demand for SUVs during monsoon season'),
('Hatchback', 'Mumbai', 'Fuel Spike', 0.95, 'Price reduced due to high fuel costs in metro areas'),
('Sedan', 'New Delhi', 'All', 1.05, 'High demand for premium sedans in NCR'),
('Electric', 'All', 'All', 1.10, 'High demand for EVs due to subsidies and fuel prices');

-- Seed User Notification Preferences (for Mock User 1)
DELETE FROM UserNotificationPreferences;
INSERT INTO UserNotificationPreferences (UserId, AppointmentAlerts, BidAlerts, PriceAlerts, MessageAlerts, Channel, FcmToken)
VALUES (1, 1, 1, 1, 1, 'browser', NULL);

-- Seed Wallet and Referral Code (for Mock User 1)
DELETE FROM Wallets;
INSERT INTO Wallets (UserId, Balance, CreatedAt)
VALUES (1, 500, GETUTCDATE());

DELETE FROM ReferralCodes;
INSERT INTO ReferralCodes (UserId, Code, TotalReferrals, TotalPointsEarned)
VALUES (1, 'MOCK-REF-001', 0, 0);

-- Seed Maintenance Costs
DELETE FROM MaintenanceCosts;
INSERT INTO MaintenanceCosts (Brand, Model, BaseMonthlyEstimate, MajorServiceIntervalKm) VALUES
('Maruti Suzuki', 'All', 2000, 10000),
('Hyundai', 'All', 2500, 10000),
('Honda', 'All', 3000, 10000),
('Mahindra', 'All', 3500, 15000),
('Tata', 'All', 2800, 15000),
('Default', 'All', 3000, 10000);

GO
