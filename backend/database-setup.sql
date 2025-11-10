-- Clean Water Reporter Database Setup Script
-- MySQL 8.0.x

-- Create database (Spring Boot can auto-create, but this is for manual setup)
CREATE DATABASE IF NOT EXISTS clean_water_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Use the database
USE clean_water_db;

-- Create users table (Spring Boot JPA will auto-create, but here's the structure)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(255),
    created_at VARCHAR(50),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    reporter VARCHAR(255) NOT NULL,
    date_reported VARCHAR(50),
    last_updated VARCHAR(50),
    tags TEXT,
    INDEX idx_status (status),
    INDEX idx_severity (severity),
    INDEX idx_type (type),
    INDEX idx_reporter (reporter),
    INDEX idx_date_reported (date_reported)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert demo users
INSERT INTO users (name, email, password, role, department, created_at) VALUES
('John Citizen', 'john@citizen.com', 'demo123', 'citizen', 'Community Member', '2025-11-09'),
('Sarah Official', 'sarah@waterauthority.gov', 'demo123', 'official', 'Water Quality Authority', '2025-11-09')
ON DUPLICATE KEY UPDATE name=name; -- Avoid duplicates

-- Insert demo reports
INSERT INTO reports (title, details, type, severity, status, location, reporter, date_reported, last_updated, tags) VALUES
('Drought Conditions Affecting Supply', 
 'Water levels in the main reservoir are critically low, affecting three major districts.', 
 'Drought', 'High', 'Resolved', 'Central Valley Reservoir', 'Afrid', 
 '2025-10-28', '2025-10-30', 'Unsafe Drinking Water,Infrastructure Failure'),

('Pipe Burst near High School', 
 'A major water main burst, causing flooding and service interruption.', 
 'Infrastructure', 'Critical', 'In Progress', '123 Main St, Sector 4', 'Jane Doe', 
 '2025-11-01', '2025-11-02', 'Water Leak,Road Hazard'),

('Unusual Smell in Tap Water', 
 'Tap water has a strong, chemical odor in the Western neighborhood.', 
 'Quality', 'Medium', 'Pending Review', 'Western Residential Area', 'Mark Smith', 
 '2025-11-03', '2025-11-03', 'Contamination,Health Risk')
ON DUPLICATE KEY UPDATE title=title; -- Avoid duplicates

-- Verify installation
SELECT 'Database setup completed successfully!' AS Status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_reports FROM reports;

-- Show sample data
SELECT * FROM users LIMIT 5;
SELECT * FROM reports LIMIT 5;

-- Display table structures
SHOW CREATE TABLE users;
SHOW CREATE TABLE reports;

-- Show indexes
SHOW INDEX FROM users;
SHOW INDEX FROM reports;
