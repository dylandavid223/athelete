-- Create Database
CREATE DATABASE IF NOT EXISTS athletehub;
USE athletehub;

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

-- Insert Sample Legendary Kenyan Athletes
INSERT INTO users (email, password, first_name, last_name, phone, role, county, language_preference, is_verified) VALUES
-- Legendary Athletes
('kipchoge@example.com', '$2b$12$hashedpassword', 'Eliud', 'Kipchoge', '+254711111111', 'athlete', 'Nandi', 'kalenjin', TRUE),
('rudisha@example.com', '$2b$12$hashedpassword', 'David', 'Rudisha', '+254722222222', 'athlete', 'Kilgoris', 'kalenjin', TRUE),
('dibaba@example.com', '$2b$12$hashedpassword', 'Vivian', 'Cheruiyot', '+254733333333', 'athlete', 'Uasin Gishu', 'kalenjin', TRUE),
('keter@example.com', '$2b$12$hashedpassword', 'Moses', 'Kiptanui', '+254744444444', 'athlete', 'Keiyo', 'kalenjin', TRUE),
('nyambura@example.com', '$2b$12$hashedpassword', 'Faith', 'Kipyegon', '+254755555555', 'athlete', 'Nakuru', 'kikuyu', TRUE),

-- Current Athletes
('kipruto@example.com', '$2b$12$hashedpassword', 'Conseslus', 'Kipruto', '+254766666666', 'athlete', 'Nandi', 'kalenjin', TRUE),
('obiri@example.com', '$2b$12$hashedpassword', 'Hellen', 'Obiri', '+254777777777', 'athlete', 'Kisii', 'kisii', TRUE),
('manangoi@example.com', '$2b$12$hashedpassword', 'Elijah', 'Manangoi', '+254788888888', 'athlete', 'Narok', 'kalenjin', TRUE),
('kipyegon@example.com', '$2b$12$hashedpassword', 'Ferdinand', 'Omanyala', '+254799999999', 'athlete', 'Busia', 'luo', TRUE);

-- Insert Athlete Profiles
INSERT INTO athlete_profiles (user_id, date_of_birth, gender, bio, specialization, county_origin, years_active, is_legend, achievements, personal_records) VALUES
-- Eliud Kipchoge
(1, '1984-11-05', 'male', 'World marathon record holder and Olympic champion. First human to run marathon under 2 hours.', 'marathon', 'Nandi', 20, TRUE,
 '["Olympic Gold Medalist", "World Marathon Record Holder", "First sub-2 hour marathon", "Multiple World Major Marathon Wins"]',
 '{"marathon": "2:01:09", "half_marathon": "59:25", "10000m": "26:49.02"}'),

-- David Rudisha
(2, '1988-12-17', 'male', 'World record holder in 800 meters and two-time Olympic champion.', 'middle_distance', 'Kilgoris', 15, TRUE,
 '["Olympic Gold Medalist 2012, 2016", "World Record 800m Holder", "World Champion"]',
 '{"800m": "1:40.91", "400m": "45.50", "1000m": "2:14.20"}'),

-- Vivian Cheruiyot (Dibaba)
(3, '1983-09-11', 'female', 'Olympic champion and multiple world champion in long-distance running.', 'middle_distance', 'Uasin Gishu', 18, TRUE,
 '["Olympic Gold Medalist", "World Champion 5000m", "Commonwealth Games Champion"]',
 '{"5000m": "14:20.87", "10000m": "29:32.53", "3000m": "8:28.66"}'),

-- Moses Kiptanui
(4, '1970-10-01', 'male', 'Pioneer of steeplechase and former world record holder.', 'steeplechase', 'Keiyo', 12, TRUE,
 '["World Champion Steeplechase", "World Record Holder", "Diamond League Champion"]',
 '{"3000m_sc": "7:56.16", "5000m": "12:55.30", "10000m": "27:04.20"}'),

-- Faith Kipyegon
(5, '1994-01-10', 'female', 'Olympic champion and world record holder in 1500m.', 'middle_distance', 'Nakuru', 8, FALSE,
 '["Olympic Gold Medalist", "World Record 1500m", "World Champion"]',
 '{"1500m": "3:49.11", "800m": "1:57.68", "5000m": "14:05.20"}'),

-- Conseslus Kipruto
(6, '1994-12-08', 'male', 'Olympic and world champion in steeplechase.', 'steeplechase', 'Nandi', 7, FALSE,
 '["Olympic Gold Medalist", "World Champion Steeplechase", "Diamond League Champion"]',
 '{"3000m_sc": "8:00.12", "1500m": "3:33.70"}'),

-- Hellen Obiri
(7, '1989-12-13', 'female', 'World champion in 5000m and cross country.', 'middle_distance', 'Kisii', 10, FALSE,
 '["World Champion 5000m", "World Cross Country Champion", "Olympic Silver Medalist"]',
 '{"5000m": "14:18.37", "10000m": "29:15.03", "3000m": "8:20.68"}'),

-- Elijah Manangoi
(8, '1993-01-05', 'male', 'World champion in 1500 meters.', 'middle_distance', 'Narok', 6, FALSE,
 '["World Champion 1500m", "African Champion", "Commonwealth Silver Medalist"]',
 '{"1500m": "3:28.80", "800m": "1:44.56"}'),

-- Ferdinand Omanyala
(9, '1996-01-02', 'male', 'African record holder in 100 meters.', 'sprint', 'Busia', 4, FALSE,
 '["African Record Holder 100m", "Commonwealth Games Finalist", "African Champion"]',
 '{"100m": "9.77", "200m": "20.33"}');

-- Insert Detailed Achievements
INSERT INTO achievements (athlete_id, event_name, event_type, year, medal, location, record_time, description) VALUES
-- Eliud Kipchoge Achievements
(1, 'Olympic Games', 'olympics', 2016, 'gold', 'Rio de Janeiro', '2:08:44', 'Gold Medal in Marathon'),
(1, 'Olympic Games', 'olympics', 2021, 'gold', 'Tokyo', '2:08:38', 'Gold Medal in Marathon'),
(1, 'Berlin Marathon', 'other', 2018, 'gold', 'Berlin', '2:01:39', 'World Record Marathon'),
(1, 'INEOS 1:59 Challenge', 'other', 2019, 'gold', 'Vienna', '1:59:40', 'First sub-2 hour marathon'),

-- David Rudisha Achievements
(2, 'Olympic Games', 'olympics', 2012, 'gold', 'London', '1:40.91', 'World Record 800m'),
(2, 'Olympic Games', 'olympics', 2016, 'gold', 'Rio de Janeiro', '1:42.15', 'Gold Medal 800m'),
(2, 'World Championships', 'world_championships', 2011, 'gold', 'Daegu', '1:43.91', 'World Champion 800m'),
(2, 'World Championships', 'world_championships', 2015, 'gold', 'Beijing', '1:45.84', 'World Champion 800m'),

-- Faith Kipyegon Achievements
(5, 'Olympic Games', 'olympics', 2016, 'gold', 'Rio de Janeiro', '4:08.92', 'Gold Medal 1500m'),
(5, 'Olympic Games', 'olympics', 2021, 'gold', 'Tokyo', '3:53.11', 'Gold Medal 1500m'),
(5, 'World Championships', 'world_championships', 2017, 'gold', 'London', '4:02.59', 'World Champion 1500m'),
(5, 'Diamond League', 'other', 2023, 'gold', 'Florence', '3:49.11', 'World Record 1500m'),

-- Ferdinand Omanyala Achievements
(9, 'African Championships', 'african_championships', 2022, 'gold', 'Mauritius', '9.93', 'African Champion 100m'),
(9, 'Kip Keino Classic', 'other', 2022, 'gold', 'Nairobi', '9.77', 'African Record 100m'),
(9, 'Commonwealth Games', 'commonwealth', 2022, 'bronze', 'Birmingham', '10.02', 'Bronze Medal 100m');

-- Insert Sample Events
INSERT INTO events (event_name, event_date, location, event_type, description, registration_deadline, is_upcoming) VALUES
('Tokyo Olympics', '2021-07-23', 'Tokyo, Japan', 'championship', 'Summer Olympic Games', '2021-03-01', FALSE),
('World Athletics Championships', '2023-08-19', 'Budapest, Hungary', 'championship', 'World Athletics Championships', '2023-05-01', FALSE),
('Paris Olympics', '2024-07-26', 'Paris, France', 'championship', 'Summer Olympic Games 2024', '2024-03-01', TRUE),
('Boston Marathon', '2024-04-15', 'Boston, USA', 'marathon', 'World Marathon Major', '2024-01-15', TRUE),
('Kip Keino Classic', '2024-05-13', 'Nairobi, Kenya', 'track', 'Continental Tour Gold Meeting', '2024-04-01', TRUE),
('World Cross Country Championships', '2024-03-30', 'Belgrade, Serbia', 'cross_country', 'World Cross Country Championships', '2024-01-30', TRUE);

-- Create additional tables for the app functionality
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