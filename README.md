# 🏫 School Management System

> A modern, full-stack School Management web application tailored for students, parents, and administrators — built as a college project for **Sandhya Kamble**.

---

## 📸 Preview

| Portal | Description |
|------|-------------|
| 🎓 User Portal | Student/Parent dashboard, attendance, fees, results, events, news |
| 🛡 Admin Panel | Analytics, attendance management, fee tracking, user management, messages |

---

## ✨ Features

- 🎨 **Premium UI** — Clean, modern, and responsive interface
- 🔐 **Role-Based Auth** — Separate workflows for Students, Parents, and Admins
- 📊 **Dashboard & Analytics** — Real-time stats on students, classes, attendance, and fees collected
- 📝 **Academic Management** — Manage attendance, results, and courses seamlessly
- 🗓 **Events & News** — Keep everyone updated with school events and latest news
- 💬 **Messaging System** — Submit and manage messages and notices
- 🔄 **Real-Time Updates** — SSE-powered live updates across admin and user portals

---

## 🔐 Login Credentials

### 🛡 Admin Login
| Field | Value |
|-------|-------|
| Email | `sandhya@admin.com` |
| Password | `1234` |
| Redirects to | Admin Panel |

### 🎓 Student Login (Demo)
| Field | Value |
|-------|-------|
| Email | `student@abc.com` |
| Password | `1234` |
| Redirects to | Student Dashboard |

### 👨‍👩‍👦 Parent Login (Demo)
| Field | Value |
|-------|-------|
| Email | `parent@abc.com` |
| Password | `1234` |
| Redirects to | Parent Dashboard |

> 💡 The system includes generated demo accounts for immediate testing.

---

## 🌐 Application URLs

| Role | URL | Description |
|------|-----|-------------|
| 🎓 User Portal | `http://localhost:3000` | Main application for students and parents |
| 🛡 Admin Panel | `http://localhost:3001/admin` | Full administrative control panel |

---

## 🚀 How to Run

### Prerequisites
Make sure you have **Node.js** installed.
```bash
node --version
npm --version
```

### 1. Clone / Open the Project
```bash
cd "d:\Workspaces\OpenSource Projects\Sandhya Kamble\School management"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
node server.js
```
*Note: This will start both the User Server on Port 3000 and the Admin Server on Port 3001 concurrently.*

> ✅ Open `http://localhost:3000` in your browser for the user portal.  
> ✅ Open `http://localhost:3001/admin` for the admin panel.

---

## 🏗️ Project Structure

```
School management/
│
├── server.js              # Main Express server (Runs User & Admin apps)
├── package.json           # Project config & npm scripts
│
├── backend/
│   └── data/              # JSON-based databases
│       ├── users.json
│       ├── attendance.json
│       ├── fees.json
│       ├── results.json
│       ├── events.json
│       ├── news.json
│       ├── messages.json
│       └── notifications.json
│
├── user-frontend/         # Student & Parent Portal (Served on Port 3000)
│   ├── index.html
│   └── ...
│
└── admin-panel/           # Admin Dashboard (Served on Port 3001/admin)
    ├── index.html
    └── ...
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | JSON file structure (`backend/data/*.json`) |
| **Real-time** | Server-Sent Events (SSE) for live updates |
| **Design** | Responsive Design, Interactive Layout |

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/login` | Login with email & password |

### Analytics
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/stats` | Dashboard statistics (students, classes, etc.) |

### Data Management
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/data/:collection` | Get all records from a specific collection |
| POST | `/api/data/:collection` | Create a new record in a collection |
| PUT | `/api/data/:collection/:id` | Update an existing record |
| DELETE | `/api/data/:collection/:id` | Drop a record from a collection |

### Real-Time
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/events-stream` | SSE stream for real-time notifications |

---

## 🧑‍💻 About the Developer

<div align="center">

### Prathamesh Giri

*Full-Stack Developer & UI/UX Designer*

🌐 **Portfolio:** [prathameshgiri.in](https://prathameshgiri.in/)  
🛠 **Build Projects:** [build.prathameshgiri.in](https://build.prathameshgiri.in/)

</div>

---

## 🎓 Project Info

| Field | Details |
|-------|---------|
| **Project Type** | College School Management Project |
| **Made For** | Sandhya Kamble |
| **Developer** | Prathamesh Giri |
| **Year** | 2026 |
| **Purpose** | Academic / Demo |

---

## 📄 License

This project was built as a **college project** for **Sandhya Kamble**.  
Developed by **Prathamesh Giri** — All rights reserved © 2026.

---

<div align="center">


**[prathameshgiri.in](https://prathameshgiri.in/)** • **[build.prathameshgiri.in](https://build.prathameshgiri.in/)**

</div>

