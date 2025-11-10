-- filepath: /kenyan-athletes-admin/kenyan-athletes-admin/src/db/schema.sql
-- This file contains the SQL schema for creating the necessary tables in the database.

CREATE DATABASE IF NOT EXISTS kenyan_athletes;
USE kenyan_athletes;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('athlete', 'sponsor', 'coach', 'government', 'user') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    county VARCHAR(100),
    language_preference ENUM('english', 'swahili', 'kikuyu', 'luo', 'kalenjin') DEFAULT 'english',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Athletes Profile Table
CREATE TABLE athlete_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    bio TEXT,
    specialization ENUM('sprint', 'marathon', 'middle_distance', 'field_events', 'steeplechase'),
    county_origin VARCHAR(100),
    years_active INT,
    profile_image VARCHAR(255),
    is_legend BOOLEAN DEFAULT FALSE,
    achievements JSON,
    personal_records JSON,
    profile_visibility ENUM('public', 'private', 'sponsors_only') DEFAULT 'private',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Historical Achievements Table
CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    athlete_id INT,
    event_name VARCHAR(255) NOT NULL,
    event_type ENUM('olympics', 'world_championships', 'commonwealth', 'african_championships', 'other'),
    year YEAR NOT NULL,
    medal ENUM('gold', 'silver', 'bronze', 'none'),
    location VARCHAR(255),
    record_time VARCHAR(50),
    description TEXT,
    FOREIGN KEY (athlete_id) REFERENCES athlete_profiles(id) ON DELETE CASCADE
);

-- Events Table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255) NOT NULL,
    event_date DATE,
    location VARCHAR(255),
    event_type ENUM('track', 'marathon', 'cross_country', 'championship'),
    description TEXT,
    registration_deadline DATE,
    is_upcoming BOOLEAN DEFAULT TRUE
);

-- User Consents Table
CREATE TABLE user_consents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    athlete_id INT,
    coach_id INT NULL,
    sponsor_id INT NULL,
    consent_type ENUM('training_data', 'medical_info', 'contact_info', 'performance_data'),
    granted BOOLEAN DEFAULT FALSE,
    granted_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (athlete_id) REFERENCES athlete_profiles(id),
    FOREIGN KEY (coach_id) REFERENCES users(id),
    FOREIGN KEY (sponsor_id) REFERENCES users(id)
);

-- Nutrition Tracking Table
CREATE TABLE nutrition_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    athlete_id INT,
    date DATE NOT NULL,
    calories INT,
    protein DECIMAL(5,2),
    carbs DECIMAL(5,2),
    fats DECIMAL(5,2),
    water_intake DECIMAL(5,2),
    notes TEXT,
    FOREIGN KEY (athlete_id) REFERENCES athlete_profiles(id) ON DELETE CASCADE
);

-- Exercise Tracking Table
CREATE TABLE exercise_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    athlete_id INT,
    date DATE NOT NULL,
    exercise_type VARCHAR(100),
    duration_minutes INT,
    intensity ENUM('low', 'medium', 'high'),
    distance_km DECIMAL(5,2),
    notes TEXT,
    points_earned INT DEFAULT 0,
    FOREIGN KEY (athlete_id) REFERENCES athlete_profiles(id) ON DELETE CASCADE
);