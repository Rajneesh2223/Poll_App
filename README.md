# 🗳️ Real-Time Polling App

A real-time polling web application where teachers can create polls, students can vote, and both can chat live. Built with **React (Vite)**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.

---

## 🚀 Features

### 👩‍🏫 Teacher
- Register with a name and role = "Teacher"
- Create polls with a timer and up to 4 options
- See real-time results while students vote
- View full **poll history**
- Chat with students
- Kick any student from the poll room

### 🧑‍🎓 Student
- Register with a name and role = "Student"
- Participate in live polls
- Vote only once per poll
- View poll results after voting
- Chat with teachers and other students

---

## 🧱 Tech Stack

| Layer       | Technology             |
|-------------|------------------------|
| Frontend    | React (Vite)           |
| Backend     | Node.js + Express.js   |
| Real-time   | Socket.IO              |
| Database    | MongoDB (Mongoose)     |
| Deployment  | Render (Backend)       |

---

## 📁 Folder Structure
```
Poll_App/
├── frontend/ # React Vite frontend
└── backend/ # Node.js + Express + Socket.IO backend
```

---



### Clone the repository
```bash
git clone https://github.com/Rajneesh2223/Poll_App.git
cd Poll_App

Backend Setup
cd backend
npm install
Create a .env file in /backend:

env
PORT= 4000
MONGO_URI=your_mongodb_connection_string
Start the backend server:

node server.js

💻 Frontend Setup
cd ../frontend
npm install
Create a .env file in /frontend:

VITE_API_URL=http://localhost:4000
For production builds (e.g. Render or Vercel), use:


VITE_API_URL=https://poll-app-backend-mw1p.onrender.com
Run the development server:

