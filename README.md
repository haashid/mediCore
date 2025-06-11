# 🩺 MediCore - Online Clinic & Appointment Booking System

![Banner](https://github.com/user-attachments/assets/f2aa34f2-523e-4d81-89d2-a46608eedd76)
![Admin Login](https://github.com/user-attachments/assets/cdb6e318-c396-46fd-81ad-c08525560fa5)

## 🚀 Features

- 👤 Multi-role login system (Admin, Doctor, Patient)
- 🛡️ Secure JWT-based Authentication
- 🗂️ Doctor Profiles & Availability Scheduling
- 📆 Live Appointment Booking System
- 📊 Admin Dashboard with Doctor & Patient Management
- 🔧 Built using Node.js, MySQL, and Next.js 14

---

## 🖼️ Screenshots

#### **Registration page**
![Admin Dashboard](https://github.com/user-attachments/assets/acca47b2-532c-449c-841f-bd40f6f7ef08)

#### **login page**
![Doctor Dashboard](https://github.com/user-attachments/assets/78228c73-4cdc-4059-806f-42f261e51423)

#### **Doctor Profile Management**
![Doctor Profile](https://github.com/user-attachments/assets/889543ac-858d-4789-adb1-c9b6aff56ecf)

#### **Patient Booking System**
![Booking](https://github.com/user-attachments/assets/276719a0-9608-4357-b763-cc5f5c8f40d4)

#### **Patient Dashboard**
![Patient Dashboard](https://github.com/user-attachments/assets/8bfa80b3-e242-4582-8419-9fea07763a22)

---

## 🧰 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | Next.js 14, Tailwind CSS      |
| Backend    | Node.js, Express.js           |
| Database   | MySQL (XAMPP)                 |
| Auth       | JWT, bcrypt                   |

---

## 📦 Setup Instructions

### 1. Configure MySQL

- Start XAMPP (MySQL & Apache)
- Create a DB called `db` via phpMyAdmin
- Import the included SQL file

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd medicore
npm install
```
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db
JWT_SECRET=your_secret_key
```
Run the App
```bash

npm run dev
```
👤 Demo Credentials
Admin: admin@medicore.com / admin123

Doctor: dr.sarah@medicore.com / doctor123

Patient: patient@medicore.com / patient123

🔐 Security Highlights
JWT token-based access

Encrypted passwords with bcrypt

Role-based access control

🌐 Sample API Routes:
Method	Endpoint	Description

POST	/api/auth/register	Register a user

POST	/api/auth/login	Login

GET	/api/doctors	Get all doctors

POST	/api/appointments	Book an appointment

📈 Future Scope
📧 Email / SMS notifications

📹 Video consultations

💳 Payment gateway integration

📱 Mobile app support
