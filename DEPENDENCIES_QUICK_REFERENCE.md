# Dependencies Quick Reference Guide

## 🔧 Backend Dependencies

| Package | Version | Purpose | When It's Used |
|---------|---------|---------|----------------|
| **express** | ^5.1.0 | Web server framework | Every HTTP request (login, register, etc.) |
| **mongoose** | ^8.19.2 | MongoDB database connection | Saving/reading user data, meeting history |
| **socket.io** | ^4.8.1 | Real-time communication | Video calls, chat messages, user join/leave |
| **bcrypt** | ^6.0.0 | Password hashing | When user registers or logs in |
| **cors** | ^2.8.5 | Cross-origin requests | Allows frontend (port 3000) to talk to backend (port 8000) |
| **crypto** | ^1.0.1 | Token generation | Creates authentication tokens after login |
| **http-status** | ^2.1.0 | HTTP status codes | Makes code cleaner (use `OK` instead of `200`) |

---

## 🎨 Frontend Dependencies

| Package | Version | Purpose | When It's Used |
|---------|---------|---------|----------------|
| **react** | ^19.2.0 | UI library | Building all components |
| **react-dom** | ^19.2.0 | React rendering | Rendering components to browser |
| **react-router-dom** | ^7.9.5 | Page navigation | Switching between Landing, Login, Home, Video pages |
| **socket.io-client** | ^4.8.1 | Real-time client | Connecting to Socket.IO server for video calls |
| **axios** | ^1.13.2 | HTTP requests | Sending login/register requests to backend |
| **@mui/material** | ^7.3.5 | UI components | Buttons, text fields, cards, icons |
| **@mui/icons-material** | ^7.3.5 | Material icons | Video, mic, chat icons |
| **@emotion/react** | ^11.14.0 | CSS-in-JS | Required by Material-UI for styling |
| **@emotion/styled** | ^11.14.1 | Styled components | Required by Material-UI |
| **react-scripts** | ^5.0.1 | Build tools | Running dev server, building for production |
| **web-vitals** | ^2.1.4 | Performance metrics | Optional: measuring app performance |

---

## 📦 Installation Commands

### Backend:
```bash
cd backend
npm install
```

### Frontend:
```bash
cd frontend
npm install
```

---

## 🔍 What Each Dependency Does (One Sentence Each)

### Backend:
- **express**: Creates the web server that handles all HTTP requests
- **mongoose**: Connects your code to MongoDB database to save/read data
- **socket.io**: Enables instant communication between server and clients (for video calls)
- **bcrypt**: Encrypts passwords so they're secure in the database
- **cors**: Allows your React app to make requests to your Node.js server
- **crypto**: Generates random authentication tokens for logged-in users
- **http-status**: Provides readable HTTP status code names (like `OK`, `NOT_FOUND`)

### Frontend:
- **react**: The JavaScript library that builds your user interface
- **react-dom**: Renders React components to the browser's DOM
- **react-router-dom**: Handles navigation between different pages/routes
- **socket.io-client**: The client-side part of Socket.IO for real-time features
- **axios**: Makes HTTP requests to your backend API (like login, register)
- **@mui/material**: Pre-built beautiful UI components (buttons, forms, etc.)
- **@mui/icons-material**: Icon library for Material-UI components
- **@emotion/react** & **@emotion/styled**: Styling libraries required by Material-UI
- **react-scripts**: Tools to run, build, and test your React app
- **web-vitals**: Measures and reports on web performance metrics

---

## 🎯 Dependencies by Feature

### Authentication:
- Backend: `express`, `mongoose`, `bcrypt`, `crypto`
- Frontend: `axios`, `react-router-dom`

### Video Conferencing:
- Backend: `socket.io`
- Frontend: `socket.io-client`, `react` (for WebRTC APIs)

### Database:
- Backend: `mongoose`

### UI Components:
- Frontend: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`

### Routing:
- Frontend: `react-router-dom`

### Build Tools:
- Frontend: `react-scripts`

---

## ⚠️ Important Notes

1. **socket.io** and **socket.io-client** must be the same version (both ^4.8.1) for compatibility
2. **@emotion/react** and **@emotion/styled** are required dependencies for Material-UI
3. **crypto** is actually a built-in Node.js module, but a wrapper package is listed
4. **react** and **react-dom** versions should match (both ^19.2.0)
5. **http-status** is used in both frontend and backend for consistency

---

## 🔄 How Dependencies Work Together

```
Frontend (React) 
    ↓ axios
Backend (Express) 
    ↓ mongoose
MongoDB Database

Frontend (Socket.IO Client)
    ↓ WebSocket
Backend (Socket.IO Server)
    ↓ Real-time events
All Connected Clients
```

---

## 📚 Learning Resources

- **Express**: https://expressjs.com/
- **React**: https://react.dev/
- **Socket.IO**: https://socket.io/docs/
- **Mongoose**: https://mongoosejs.com/docs/
- **Material-UI**: https://mui.com/
- **WebRTC**: https://webrtc.org/

