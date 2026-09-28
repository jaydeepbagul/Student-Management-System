<<<<<<< HEAD
# student---management--system
Student Attendance and Grade management System
=======
# Student Attendance and Grade Management System

A full-stack, modern web application for managing student records, tracking attendance, and analyzing academic performance.

## 🚀 Features
- **Admin Authentication**: Secure login system.
- **Student CRUD**: Add, Update, View, and Delete students.
- **Attendance Tracking**: Mark daily attendance and generate reports.
- **Grade Management**: Record subjects and marks for students.
- **Performance Analytics**: Dashboards showing average scores and top students.

---

## 🛠️ Technology Stack
- **Frontend**: HTML5, CSS3 (Modern UI), JavaScript (Vanilla ES6)
- **Backend**: Node.js, Express.js
- **Database**: MySQL

---

## 📂 Project Structure
```
├── backend/
│   ├── .env               # Database configuration
│   ├── db.js              # MySQL connection pool
│   ├── package.json       # Dependencies
│   └── server.js          # REST API endpoints
├── frontend/
│   ├── app.js             # Frontend logic & API calls
│   ├── index.html         # UI Structure
│   └── style.css          # Modern Styling
└── setup/
    └── database.sql       # SQL scripts to create database & tables
```

---

## 📝 Setup & Execution Guide

### 1. Database Setup (MySQL)
1. Open your MySQL terminal (or Tool like phpMyAdmin / MySQL Workbench).
2. Create the database and tables using the provided script:
   ```bash
   # You can run this in your MySQL console
   SOURCE setup/database.sql;
   ```
   *The script creates a database named `student_management` and adds a default admin:*
   - **Username**: `admin`
   - **Password**: `admin123`

### 2. Backend Setup (Node.js)
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` file:
   Open `backend/.env` and ensure your MySQL credentials (`DB_USER`, `DB_PASSWORD`) are correct.
4. Start the server:
   ```bash
   npm start
   ```
   *The server will run on `http://localhost:5000`.*

### 3. Frontend Setup
1. Simply open `frontend/index.html` in any modern web browser.
2. Login using the default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

### 4. Testing
1. **Students**: Go to the Students tab and add some students.
2. **Attendance**: Go to the Attendance tab, select a date, and mark "Present" or "Absent".
3. **Grades**: Go to Grades, select a student, and add marks for multiple subjects.
4. **Dashboard**: Visit the Dashboard to see real-time analytics and the "Top Students" list.

---

## ⚠️ Troubleshooting
- **CORS Errors**: Ensure the backend server is running while using the frontend.
- **Database Connection**: Verify your MySQL service is running and credentials in `.env` match.
- **No Data**: Add at least one student and some marks for analytics to show up.
>>>>>>> 423d1f3 (Initial commit)
