-- Email OTP table
CREATE TABLE EmailOTP (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    otp VARCHAR(10) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
-- Sparklink Dating App - MySQL Schema

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    full_name VARCHAR(100),
    age INT,
    gender ENUM('male', 'female', 'other'),
    city VARCHAR(100),
    bio VARCHAR(500),
    profile_photo_url VARCHAR(255),
    language VARCHAR(10),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE UserPhotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    interested_in ENUM('male', 'female', 'other', 'all'),
    min_age INT,
    max_age INT,
    min_height INT,
    max_height INT,
    max_distance_km INT,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Interests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE UserInterests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    interest_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES Interests(id) ON DELETE CASCADE
);

CREATE TABLE Questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    type ENUM('single_choice', 'scale', 'text')
);

CREATE TABLE Questionnaire (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    answer VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Questions(id) ON DELETE CASCADE
);

CREATE TABLE Matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    status ENUM('pending', 'matched', 'unmatched', 'blocked'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('match', 'alert', 'meeting', 'reward'),
    message VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(255),
    discount_percent INT,
    qr_code_url VARCHAR(255),
    expiration_date DATE
);

CREATE TABLE UserOffers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    offer_id INT NOT NULL,
    redeemed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES Rewards(id) ON DELETE CASCADE
);

CREATE TABLE Location (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE VideoCalls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    scheduled_time DATETIME,
    status ENUM('pending', 'completed', 'cancelled'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES Matches(id) ON DELETE CASCADE
);