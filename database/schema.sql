-- Create database
CREATE DATABASE IF NOT EXISTS db;
USE db;

-- Users table for all user types (admin, doctor, patient)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  user_type ENUM('admin', 'doctor', 'patient') NOT NULL DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doctors additional information
CREATE TABLE IF NOT EXISTS doctors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  experience_years INT DEFAULT 0,
  consultation_fee DECIMAL(10,2) DEFAULT 0.00,
  location VARCHAR(255),
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments management
CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason TEXT,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Doctor availability slots
CREATE TABLE IF NOT EXISTS availability (
  id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id INT NOT NULL,
  day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (email, password_hash, first_name, last_name, user_type) 
VALUES ('admin@medicore.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin');

-- Insert sample doctors
INSERT IGNORE INTO users (email, password_hash, first_name, last_name, phone, user_type) VALUES
('dr.sarah@medicore.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah', 'Johnson', '+1-555-0123', 'doctor'),
('dr.michael@medicore.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Michael', 'Chen', '+1-555-0124', 'doctor'),
('dr.emily@medicore.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Emily', 'Rodriguez', '+1-555-0125', 'doctor');

-- Insert doctor profiles
INSERT IGNORE INTO doctors (user_id, specialization, license_number, experience_years, consultation_fee, location, bio) VALUES
((SELECT id FROM users WHERE email = 'dr.sarah@medicore.com'), 'Cardiology', 'MD123456', 15, 150.00, 'Downtown Medical Center', 'Experienced cardiologist specializing in heart disease prevention and treatment.'),
((SELECT id FROM users WHERE email = 'dr.michael@medicore.com'), 'Dermatology', 'MD123457', 12, 120.00, 'Skin Care Clinic', 'Board-certified dermatologist with expertise in skin conditions and cosmetic procedures.'),
((SELECT id FROM users WHERE email = 'dr.emily@medicore.com'), 'Neurology', 'MD123458', 18, 200.00, 'Brain & Spine Institute', 'Neurologist specializing in brain and nervous system disorders.');

-- Insert sample patient
INSERT IGNORE INTO users (email, password_hash, first_name, last_name, phone, user_type) VALUES
('patient@medicore.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', '+1-555-0100', 'patient');
