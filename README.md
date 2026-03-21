# ✈ PRAVAAS – Smart Travel Safety & Management System

PRAVAAS is a full-stack travel safety and management web application designed to help users plan trips, monitor risks, manage expenses, and access emergency SOS features. It integrates secure authentication, Google login, and real-time backend APIs.

---

# 🌟 Features

## 🔐 Authentication

* User Registration
* User Login
* Google OAuth Login
* Secure session handling

## 🧭 Travel Management

* Create trips
* View trip history
* Travel dashboard overview

## 💰 Expense Tracking

* Add expenses
* Track trip spending
* Expense overview per trip

## 🌦 Weather Monitoring

* Real-time weather data
* Weather risk analysis

## ⚠ Risk Detection

* Travel risk alerts
* Conflict zone detection

## 🚨 Emergency SOS

* Send emergency SOS alert
* Location-based safety support

---

# 🏗 Project Structure

```
PRAVAAS/
│
├── backend/
│   ├── login.php
│   ├── register.php
│   ├── google_login.php
│   ├── create_trip.php
│   ├── add_expense.php
│   ├── get_dashboard.php
│   ├── get_weather.php
│   ├── get_risk.php
│   ├── send_sos.php
│   └── db.php
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── profile.html
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── login.js
│   │   └── config.js
│   │
│   └── assets/
│       ├── css/
│       ├── images/
│       └── fonts/
│
├── database/
│   └── pravas.sql
│
└── README.md
```

---

# 🧰 Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* Google OAuth

## Backend

* PHP 8+
* REST API Architecture

## Database

* PostgreSQL

## Tools

* VS Code
* Git & GitHub
* Google Cloud Console
* PHP Built-in Server

---

# ⚙ Installation Guide

## 1. Clone repository

```bash
git clone https://github.com/yourusername/pravaas.git
cd pravaas
```

---

## 2. Setup Database

Open PostgreSQL and run:

```
database/pravas.sql
```

Update database connection in:

```
backend/db.php
```

---

## 3. Start Backend Server

```bash
php -S localhost:8000
```

---

## 4. Run Frontend

Open browser:

```
http://localhost:8000/frontend/index.html
```

---

# 🔑 Google Login Setup

1. Go to Google Cloud Console
2. Create OAuth Client ID
3. Add Authorized Origin:

```
http://localhost:8000
```

4. Add Client ID in:

```
frontend/index.html
```

---

# 📡 API Endpoints

| Endpoint                   | Method | Description    |
| -------------------------- | ------ | -------------- |
| /backend/register.php      | POST   | Register user  |
| /backend/login.php         | POST   | Login user     |
| /backend/google_login.php  | POST   | Google login   |
| /backend/create_trip.php   | POST   | Create trip    |
| /backend/add_expense.php   | POST   | Add expense    |
| /backend/get_dashboard.php | GET    | Dashboard data |
| /backend/get_weather.php   | GET    | Weather data   |
| /backend/get_risk.php      | GET    | Risk data      |
| /backend/send_sos.php      | POST   | Send SOS       |

---

# 👨‍💻 Team Members

* Sagar Vinod Kharbikar
* Team PRAVAAS

---

# 🚀 Current Progress

| Module                | Status         |
| --------------------- | -------------- |
| Authentication        | ✅ Complete     |
| Google Login          | ✅ Complete     |
| Backend APIs          | ✅ Complete     |
| Frontend UI           | ✅ Complete     |
| Dashboard Integration | 🔄 In Progress |
| Testing               | 🔄 In Progress |

---

# 🔮 Future Enhancements

* Live location tracking
* Mobile app version
* AI travel recommendations
* Email & SMS alerts
* Admin panel

---

# 📜 License

This project is for academic and educational purposes.

---

# ❤️ Project Vision

PRAVAAS aims to make travel safer, smarter, and more secure through intelligent monitoring and emergency support.
