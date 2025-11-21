# 🗳️ Real-Time Polling App

A real-time polling web application where teachers can create polls, students can vote, and both can chat live. Built with **React (Vite)**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.

---

## 🚀 Features

### 👩‍🏫 Teacher
- Register with a name and role = "Teacher"
- Create polls with a timer and up to 6 options
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
| Deployment  | Render/Vercel          |

---

## 📁 Folder Structure

```
Poll_App/
├── frontend/          # React Vite frontend
│   ├── src/
│   │   ├── component/ # React components
│   │   ├── utils/     # Socket.IO client
│   │   └── App.jsx    # Main app component
│   ├── .env           # Frontend environment variables
│   └── package.json
│
└── backend/           # Node.js + Express + Socket.IO backend
    ├── config/        # Database configuration
    ├── controller/    # Business logic
    ├── middleware/    # Error handling, validation
    ├── models/        # MongoDB schemas
    ├── routes/        # API routes
    ├── .env           # Backend environment variables
    ├── server.js      # Main server file
    └── socket.js      # Socket.IO event handlers
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- Git

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Rajneesh2223/Poll_App.git
cd Poll_App
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `/backend` directory:

```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGO_DB_URL=your_mongodb_connection_string

# CORS Configuration (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

> **Note**: Replace `your_mongodb_connection_string` with your actual MongoDB connection string from MongoDB Atlas.

#### Start the Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:4000`

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `/frontend` directory:

```bash
# Development
VITE_API_URL=http://localhost:4000

# Production (update with your deployed backend URL)
# VITE_API_URL=https://your-backend-url.com
```

#### Start the Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 🌐 Deployment

### Backend (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Add environment variables in Render dashboard:
   - `MONGO_DB_URL`
   - `PORT` (optional, Render provides this)
   - `ALLOWED_ORIGINS` (include your frontend URL)
   - `NODE_ENV=production`

### Frontend (Vercel)

1. Create a new project on [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Set root directory to `frontend`
4. Add environment variable:
   - `VITE_API_URL` = your deployed backend URL
5. Deploy

---

## 📡 API Documentation

### REST Endpoints

#### Health Check
```
GET /health
```
Returns server and database status.

#### Get Poll History
```
GET /api/poll-history
```
Returns all polls sorted by creation date (newest first).

### Socket.IO Events

See [API.md](./API.md) for complete Socket.IO event documentation.

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB connection string is correct in `.env`
- Check if port 4000 is already in use
- Verify all environment variables are set

### Frontend can't connect to backend
- Verify `VITE_API_URL` in frontend `.env` matches backend URL
- Check CORS configuration in backend
- Ensure backend server is running

### Socket connection issues
- Check browser console for connection errors
- Verify firewall isn't blocking WebSocket connections
- Ensure backend CORS allows your frontend origin

### Database connection failed
- Verify MongoDB Atlas IP whitelist includes your IP (or use 0.0.0.0/0 for development)
- Check MongoDB connection string format
- Ensure database user has proper permissions

---

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use strong MongoDB passwords
- In production, restrict CORS to specific origins
- Implement rate limiting for production deployments
- Use HTTPS in production

---

## 📝 License

ISC

---

## 👨‍💻 Author

Rajneesh Kumar

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For issues and questions, please open an issue on GitHub.
