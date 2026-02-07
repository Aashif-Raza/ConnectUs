# Video Conferencing Application - Complete Code Explanation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Dependencies Explained](#dependencies-explained)
3. [Backend Structure](#backend-structure)
4. [Frontend Structure](#frontend-structure)
5. [How Everything Works Together](#how-everything-works-together)

---

## 🎯 Project Overview

This is a **MERN Stack** (MongoDB, Express, React, Node.js) video conferencing application called **"ConnectUs"**. It allows users to:
- Register and login
- Create/join video meetings with unique meeting codes
- Video chat with multiple participants
- Share screens
- Chat during video calls
- View meeting history

---

## 📦 Dependencies Explained

### Backend Dependencies (`backend/package.json`)

#### 1. **express** (^5.1.0)
- **What it is**: A web framework for Node.js
- **Why we need it**: Creates the server that handles HTTP requests (like login, register, etc.)
- **Simple explanation**: It's like the foundation of your house - everything else builds on top of it

#### 2. **mongoose** (^8.19.2)
- **What it is**: A library to connect Node.js with MongoDB database
- **Why we need it**: Stores user data (usernames, passwords, meeting history) in the database
- **Simple explanation**: It's like a translator between your code and the database

#### 3. **socket.io** (^4.8.1)
- **What it is**: Enables real-time, bidirectional communication between server and clients
- **Why we need it**: Handles video call connections, chat messages, and user join/leave events in real-time
- **Simple explanation**: It's like a walkie-talkie that lets the server and clients talk instantly

#### 4. **bcrypt** (^6.0.0)
- **What it is**: A library for hashing passwords
- **Why we need it**: Encrypts passwords so they're not stored in plain text (security)
- **Simple explanation**: It scrambles passwords so even if someone hacks the database, they can't read them

#### 5. **cors** (^2.8.5)
- **What it is**: Cross-Origin Resource Sharing middleware
- **Why we need it**: Allows the frontend (running on port 3000) to communicate with backend (port 8000)
- **Simple explanation**: It's like a security guard that allows your frontend and backend to talk to each other

#### 6. **crypto** (^1.0.1)
- **What it is**: Node.js built-in module for cryptographic functions
- **Why we need it**: Generates random tokens for user authentication
- **Simple explanation**: Creates random secret codes to identify logged-in users

#### 7. **http-status** (^2.1.0)
- **What it is**: HTTP status code constants
- **Why we need it**: Makes code cleaner by using names like `OK` instead of numbers like `200`
- **Simple explanation**: Instead of remembering "200 means success", you write `httpStatus.OK`

---

### Frontend Dependencies (`frontend/package.json`)

#### 1. **react** (^19.2.0) & **react-dom** (^19.2.0)
- **What it is**: JavaScript library for building user interfaces
- **Why we need it**: Creates all the visual components (buttons, forms, video players)
- **Simple explanation**: It's the tool that builds everything you see on the screen

#### 2. **react-router-dom** (^7.9.5)
- **What it is**: Library for routing/navigation in React apps
- **Why we need it**: Handles different pages (Landing, Login, Home, Video Call)
- **Simple explanation**: It's like a GPS that takes you to different pages when you click links

#### 3. **socket.io-client** (^4.8.1)
- **What it is**: Client-side version of socket.io
- **Why we need it**: Connects the frontend to the socket.io server for real-time communication
- **Simple explanation**: The frontend's walkie-talkie to talk to the backend

#### 4. **axios** (^1.13.2)
- **What it is**: HTTP client for making API requests
- **Why we need it**: Sends login/register requests to the backend
- **Simple explanation**: It's like a mailman that delivers requests to the server and brings back responses

#### 5. **@mui/material** (^7.3.5) & **@mui/icons-material** (^7.3.5)
- **What it is**: Material-UI component library
- **Why we need it**: Provides pre-built beautiful components (buttons, text fields, icons)
- **Simple explanation**: Ready-made UI pieces so you don't have to build buttons from scratch

#### 6. **@emotion/react** & **@emotion/styled** (^11.14.0)
- **What it is**: CSS-in-JS styling library
- **Why we need it**: Required by Material-UI for styling components
- **Simple explanation**: Helps Material-UI style its components

#### 7. **react-scripts** (^5.0.1)
- **What it is**: Create React App's build tools
- **Why we need it**: Compiles React code, runs development server, builds for production
- **Simple explanation**: The engine that runs and builds your React app

#### 8. **web-vitals** (^2.1.4)
- **What it is**: Library for measuring web performance
- **Why we need it**: Tracks how fast your app loads (optional analytics)
- **Simple explanation**: Measures how well your app performs

---

## 🗂️ Backend Structure

### 1. **`backend/src/app.js`** - Main Server File

**What it does**: This is the entry point of your backend server.

**Line by line explanation**:
```javascript
import express from "express";
```
- Imports Express framework

```javascript
import { createServer } from "node:http";
```
- Creates an HTTP server (needed for socket.io)

```javascript
import { Server } from "socket.io";
```
- Imports Socket.IO server

```javascript
import mongoose from "mongoose";
```
- Imports MongoDB connection library

```javascript
import { connectToSocket } from "./controllers/socketManager.js";
```
- Imports the function that sets up real-time communication

```javascript
import cors from "cors";
```
- Imports CORS middleware

```javascript
import userRoutes from "./routes/users.routes.js";
```
- Imports all user-related routes (login, register, etc.)

```javascript
const app = express();
const server = createServer(app);
const io = connectToSocket(server);
```
- Creates Express app, wraps it in HTTP server, connects Socket.IO

```javascript
app.set("port", (process.env.PORT || 8000))
```
- Sets server port to 8000 (or environment variable if set)

```javascript
app.use(cors());
```
- Allows frontend to make requests

```javascript
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
```
- Allows server to read JSON and form data from requests

```javascript
app.use("/api/v1/users", userRoutes);
```
- All routes starting with `/api/v1/users` go to userRoutes

```javascript
const start = async () => {
    const connectionDb = await mongoose.connect("mongodb+srv://...")
    console.log(`MONGO Connected DB HOst: ${connectionDb.connection.host}`)
    server.listen(app.get("port"), () => {
        console.log("LISTENIN ON PORT 8000")
    });
}
start();
```
- Connects to MongoDB database, then starts the server on port 8000

---

### 2. **`backend/src/models/user.model.js`** - User Database Schema

**What it does**: Defines the structure of user data in the database.

**Explanation**:
```javascript
const userScheme = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String }
})
```
- **name**: User's full name (required)
- **username**: Login username (required, must be unique)
- **password**: Hashed password (required)
- **token**: Authentication token (optional, set when user logs in)

**Simple explanation**: This is like a blueprint for how user information is stored. Every user must have a name, username, and password.

---

### 3. **`backend/src/models/meeting.model.js`** - Meeting History Schema

**What it does**: Defines the structure of meeting history data.

**Explanation**:
```javascript
const meetingSchema = new Schema({
    user_id: { type: String },
    meetingCode: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true }
})
```
- **user_id**: Which user created/joined this meeting
- **meetingCode**: The unique code for the meeting
- **date**: When the meeting happened (automatically set to current date)

**Simple explanation**: Stores a record of every meeting a user joins, like a history log.

---

### 4. **`backend/src/controllers/user.controller.js`** - User Logic

**What it does**: Contains all the business logic for user operations.

#### **`login` function**:
```javascript
const login = async (req, res) => {
    const { username, password } = req.body;
```
- Gets username and password from request

```javascript
    if (!username || !password) {
        return res.status(400).json({ message: "Please Provide" })
    }
```
- Checks if both fields are provided

```javascript
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" })
    }
```
- Searches database for user with that username

```javascript
    let isPasswordCorrect = await bcrypt.compare(password, user.password)
```
- Compares entered password with stored hashed password

```javascript
    if (isPasswordCorrect) {
        let token = crypto.randomBytes(20).toString("hex");
        user.token = token;
        await user.save();
        return res.status(httpStatus.OK).json({ token: token })
    }
```
- If password matches, creates a random token, saves it to user, returns token

**Simple explanation**: Checks if username/password are correct, then gives user a secret token to prove they're logged in.

#### **`register` function**:
```javascript
const register = async (req, res) => {
    const { name, username, password } = req.body;
```
- Gets registration data

```javascript
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(httpStatus.FOUND).json({ message: "User already exists" });
    }
```
- Checks if username already exists

```javascript
    const hashedPassword = await bcrypt.hash(password, 10);
```
- Encrypts the password

```javascript
    const newUser = new User({
        name: name,
        username: username,
        password: hashedPassword
    });
    await newUser.save();
```
- Creates new user and saves to database

**Simple explanation**: Creates a new user account if the username isn't taken, and encrypts the password.

#### **`getUserHistory` function**:
- Finds user by token, then finds all meetings for that user
- Returns list of meetings

#### **`addToHistory` function**:
- Finds user by token, creates a new meeting record
- Saves it to database

---

### 5. **`backend/src/routes/users.routes.js`** - API Routes

**What it does**: Defines the URL paths for user operations.

**Explanation**:
```javascript
router.route("/login").post(login)
```
- POST request to `/api/v1/users/login` calls the `login` function

```javascript
router.route("/register").post(register)
```
- POST request to `/api/v1/users/register` calls the `register` function

```javascript
router.route("/add_to_activity").post(addToHistory)
```
- POST request to `/api/v1/users/add_to_activity` saves a meeting to history

```javascript
router.route("/get_all_activity").get(getUserHistory)
```
- GET request to `/api/v1/users/get_all_activity` gets user's meeting history

**Simple explanation**: Maps URLs to functions. When frontend calls `/login`, it runs the login function.

---

### 6. **`backend/src/controllers/socketManager.js`** - Real-time Communication

**What it does**: Handles all real-time events (video calls, chat, user joins/leaves).

**Key Variables**:
```javascript
let connections = {}
```
- Stores which users are in which meeting rooms
- Format: `{ "meeting-code-123": ["socket-id-1", "socket-id-2"] }`

```javascript
let messages = {}
```
- Stores chat messages for each meeting room

```javascript
let timeOnline = {}
```
- Tracks when each user joined (for future use)

**Main Function - `connectToSocket`**:

```javascript
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
    }
});
```
- Creates Socket.IO server with CORS settings

#### **Event: `connection`**
When a user connects:
```javascript
io.on("connection", (socket) => {
    console.log("SOMETHING CONNECTED")
```
- A new user connected, `socket` is their connection

#### **Event: `join-call`**
When user joins a meeting:
```javascript
socket.on("join-call", (path) => {
    if (connections[path] === undefined) {
        connections[path] = []
    }
    connections[path].push(socket.id)
```
- Adds user's socket ID to the meeting room

```javascript
    for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
    }
```
- Tells everyone in the room that a new user joined

```javascript
    if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; ++a) {
            io.to(socket.id).emit("chat-message", ...)
        }
    }
```
- Sends previous chat messages to the new user

**Simple explanation**: When someone joins a meeting, add them to the room and notify others.

#### **Event: `signal`**
For WebRTC video connection:
```javascript
socket.on("signal", (toId, message) => {
    io.to(toId).emit("signal", socket.id, message);
})
```
- Forwards video connection signals between users
- **Simple explanation**: Passes video connection data between participants

#### **Event: `chat-message`**
When user sends a chat message:
```javascript
socket.on("chat-message", (data, sender) => {
    const [matchingRoom, found] = Object.entries(connections)
        .reduce(([room, isFound], [roomKey, roomValue]) => {
            if (!isFound && roomValue.includes(socket.id)) {
                return [roomKey, true];
            }
            return [room, isFound];
        }, ['', false]);
```
- Finds which meeting room the user is in

```javascript
    if (found === true) {
        if (messages[matchingRoom] === undefined) {
            messages[matchingRoom] = []
        }
        messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
```
- Saves message to that room's message history

```javascript
        connections[matchingRoom].forEach((elem) => {
            io.to(elem).emit("chat-message", data, sender, socket.id)
        })
```
- Sends message to everyone in the room

**Simple explanation**: When someone chats, save it and send to everyone in the meeting.

#### **Event: `disconnect`**
When user leaves:
```javascript
socket.on("disconnect", () => {
    var diffTime = Math.abs(timeOnline[socket.id] - new Date())
    var key
    for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
        for (let a = 0; a < v.length; ++a) {
            if (v[a] === socket.id) {
                key = k
                for (let a = 0; a < connections[key].length; ++a) {
                    io.to(connections[key][a]).emit('user-left', socket.id)
                }
                var index = connections[key].indexOf(socket.id)
                connections[key].splice(index, 1)
                if (connections[key].length === 0) {
                    delete connections[key]
                }
            }
        }
    }
})
```
- Finds which room user was in
- Tells everyone in that room the user left
- Removes user from the room
- If room is empty, deletes it

**Simple explanation**: When someone leaves, remove them from the room and notify others.

---

## 🎨 Frontend Structure

### 1. **`frontend/src/index.js`** - React Entry Point

**What it does**: The first file that runs when the app starts.

**Explanation**:
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
```
- Imports React, DOM rendering, styles, and main App component

```javascript
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
- Finds the `<div id="root">` in HTML and renders the App component inside it

**Simple explanation**: This is where React starts drawing everything on the page.

---

### 2. **`frontend/src/App.js`** - Main App Component

**What it does**: Sets up routing (navigation between pages).

**Explanation**:
```javascript
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
```
- Imports routing components

```javascript
import { AuthProvider } from './contexts/AuthContext';
```
- Imports authentication context (provides login/register functions to all pages)

```javascript
<Router>
    <AuthProvider>
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/auth' element={<Authentication />} />
            <Route path='/home' element={<HomeComponent />} />
            <Route path='/history' element={<History />} />
            <Route path='/:url' element={<VideoMeetComponent />} />
        </Routes>
    </AuthProvider>
</Router>
```
- **`/`**: Landing page (homepage)
- **`/auth`**: Login/Register page
- **`/home`**: Main dashboard after login
- **`/history`**: Meeting history page
- **`/:url`**: Any other URL (like `/abc123`) goes to video meeting page

**Simple explanation**: This is like a map that says "if user goes to /auth, show the login page".

---

### 3. **`frontend/src/contexts/AuthContext.jsx`** - Authentication State

**What it does**: Manages user authentication state and provides login/register functions.

**Explanation**:
```javascript
export const AuthContext = createContext({});
```
- Creates a context (like a global variable accessible everywhere)

```javascript
const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
});
```
- Creates an axios instance pointing to backend API

```javascript
const [userData, setUserData] = useState(null);
```
- Stores current user data

#### **`handleRegister` function**:
```javascript
const handleRegister = async (name, username, password) => {
    try {
      const request = await client.post("/register", {
        name,
        username,
        password,
      });
      if (request.status === 201) {
        return request.data.message;
      }
    } catch (err) {
      throw err;
    }
};
```
- Sends registration data to backend
- Returns success message

#### **`handleLogin` function**:
```javascript
const handleLogin = async (username, password) => {
    try {
      const request = await client.post("/login", {
        username,
        password,
      });
      if (request.status === 200) {
        localStorage.setItem("token", request.data.token);
        setUserData(request.data.user);
        navigate("/");
        return "Login successful";
      }
    } catch (err) {
      throw err;
    }
};
```
- Sends login data to backend
- Saves token to browser storage
- Redirects to home page

```javascript
return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
);
```
- Makes `handleLogin`, `handleRegister`, etc. available to all child components

**Simple explanation**: This is like a shared box that all pages can access to login/register users.

---

### 4. **`frontend/src/pages/Landing.jsx`** - Landing Page

**What it does**: The first page users see (homepage).

**Key Features**:
- Navigation bar with "Join as Guest", "Register", "Login" buttons
- Hero section with title and image
- "Get Started" button

**Simple explanation**: The welcome page that introduces the app.

---

### 5. **`frontend/src/pages/Authentication.jsx`** - Login/Register Page

**What it does**: Handles user login and registration.

**Key Features**:
```javascript
const [formState, setFormState] = React.useState(0);
```
- `0` = Login form, `1` = Register form

```javascript
const { handleRegister, handleLogin } = React.useContext(AuthContext);
```
- Gets login/register functions from context

```javascript
let handleAuth = async () => {
    if (formState === 0) {
        let result = await handleLogin(username, password)
    }
    if (formState === 1) {
        let result = await handleRegister(name, username, password);
        setFormState(0) // Switch back to login
    }
}
```
- Calls appropriate function based on form state

**Simple explanation**: A form that switches between login and register, sends data to backend.

---

### 6. **`frontend/src/pages/Home.jsx`** - Dashboard

**What it does**: Main page after login where users can join meetings.

**Key Features**:
```javascript
const [meetingCode, setMeetingCode] = useState("");
```
- Stores the meeting code user enters

```javascript
let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode)
    navigate(`/${meetingCode}`)
}
```
- Saves meeting to history, then navigates to video meeting page

**Simple explanation**: A page with a text field to enter meeting code and join button.

---

### 7. **`frontend/src/pages/VideoMeet.jsx`** - Video Call Page

**What it does**: The main video conferencing interface. This is the most complex component.

#### **Key State Variables**:
```javascript
let [videoAvailable, setVideoAvailable] = useState(true);
let [audioAvailable, setAudioAvailable] = useState(true);
```
- Tracks if camera/microphone permissions are granted

```javascript
let [video, setVideo] = useState([]);
let [audio, setAudio] = useState();
```
- Tracks if video/audio are currently on/off

```javascript
let [videos, setVideos] = useState([])
```
- Stores remote video streams from other participants

```javascript
let [messages, setMessages] = useState([])
let [message, setMessage] = useState("");
```
- Chat messages

```javascript
let [askForUsername, setAskForUsername] = useState(true);
let [username, setUsername] = useState("");
```
- Username input before joining

#### **Key Functions**:

**`getPermissions`**:
- Requests camera and microphone access from browser
- Sets up local video stream

**`connectToSocketServer`**:
```javascript
socketRef.current = io.connect(server_url, { secure: false })
```
- Connects to Socket.IO server

```javascript
socketRef.current.on('connect', () => {
    socketRef.current.emit('join-call', window.location.href)
```
- When connected, tells server which meeting room to join

```javascript
socketRef.current.on('user-joined', (id, clients) => {
    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
```
- When someone joins, creates a WebRTC peer connection for video

**WebRTC Explanation**:
- **RTCPeerConnection**: Direct video/audio connection between browsers (peer-to-peer)
- **ICE Candidates**: Network information to find the best connection path
- **SDP (Session Description Protocol)**: Describes video/audio capabilities

**`gotMessageFromServer`**:
- Handles WebRTC signaling (offer/answer/ICE candidates)
- Sets up video connection between peers

**`handleVideo`**, **`handleAudio`**, **`handleScreen`**:
- Toggle video/audio/screen sharing on/off

**`sendMessage`**:
```javascript
socketRef.current.emit('chat-message', message, username)
```
- Sends chat message to server, which broadcasts to all participants

**Simple explanation**: This page handles everything for video calls - connecting to server, setting up video streams, managing chat, and controlling camera/mic.

---

### 8. **`frontend/src/pages/History.jsx`** - Meeting History

**What it does**: Shows list of past meetings user joined.

**Key Features**:
```javascript
const { getHistoryOfUser } = useContext(AuthContext);
const [meetings, setMeetings] = useState([])
```
- Gets history function and stores meetings

```javascript
useEffect(() => {
    const fetchHistory = async () => {
        const history = await getHistoryOfUser();
        setMeetings(history);
    }
    fetchHistory();
}, [])
```
- When page loads, fetches meeting history from backend

```javascript
let formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${day}/${month}/${year}`
}
```
- Formats date for display

**Simple explanation**: Shows cards with meeting codes and dates from database.

---

### 9. **`frontend/src/utils/WithAuth.jsx`** - Authentication Guard

**What it does**: Protects pages that require login.

**Explanation**:
```javascript
const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const isAuthenticated = () => {
            if(localStorage.getItem("token")) {
                return true;
            } 
            return false;
        }
        useEffect(() => {
            if(!isAuthenticated()) {
                router("/auth")
            }
        }, [])
        return <WrappedComponent {...props} />
    }
    return AuthComponent;
}
```
- Checks if user has a token in localStorage
- If not, redirects to login page
- If yes, shows the protected component

**Usage**: `export default withAuth(HomeComponent)` - wraps Home page to protect it

**Simple explanation**: A security guard that checks if you're logged in before showing protected pages.

---

### 10. **`frontend/src/environment.js`** - Server URL

**What it does**: Stores backend server URL.

```javascript
const server = "http://localhost:8000"
export default server;
```

**Simple explanation**: Central place to change server URL if needed.

---

## 🔄 How Everything Works Together

### User Registration Flow:
1. User fills form on **Authentication.jsx**
2. Calls `handleRegister` from **AuthContext.jsx**
3. **AuthContext** sends POST to `/api/v1/users/register`
4. **Backend** receives request in **user.controller.js** → `register` function
5. Checks if username exists, hashes password, saves to MongoDB
6. Returns success message
7. Frontend shows success notification

### User Login Flow:
1. User enters credentials on **Authentication.jsx**
2. Calls `handleLogin` from **AuthContext.jsx**
3. **AuthContext** sends POST to `/api/v1/users/login`
4. **Backend** validates credentials, generates token
5. Returns token to frontend
6. Frontend saves token to localStorage
7. User redirected to **Home.jsx**

### Joining a Video Meeting:
1. User enters meeting code on **Home.jsx**
2. Clicks "Join" → navigates to `/{meetingCode}` (e.g., `/abc123`)
3. **VideoMeet.jsx** loads
4. User enters username
5. Component requests camera/mic permissions
6. Connects to Socket.IO server (`connectToSocketServer`)
7. Emits `join-call` event with meeting URL
8. **Backend socketManager.js** adds user to room
9. Emits `user-joined` to all participants
10. Each participant creates WebRTC peer connections
11. Exchange SDP offers/answers and ICE candidates
12. Video streams connect peer-to-peer
13. Users can see/hear each other

### Sending a Chat Message:
1. User types message in **VideoMeet.jsx**
2. Clicks "Send" → calls `sendMessage`
3. Emits `chat-message` event via Socket.IO
4. **Backend socketManager.js** receives message
5. Finds which room user is in
6. Saves message to `messages[room]`
7. Broadcasts to all users in room via `emit('chat-message')`
8. All participants receive message and display it

### User Leaves Meeting:
1. User closes tab or clicks "End Call"
2. Socket.IO `disconnect` event fires
3. **Backend socketManager.js** handles disconnect
4. Finds user's room, removes them from `connections[room]`
5. Emits `user-left` to remaining participants
6. Frontend removes their video from display

---

## 🎓 Key Concepts Explained Simply

### **WebRTC (Web Real-Time Communication)**
- Technology that lets browsers send video/audio directly to each other
- No server in the middle (peer-to-peer)
- Uses STUN servers to find network addresses
- **Simple analogy**: Like a direct phone call between two people

### **Socket.IO**
- Library for real-time communication
- Uses WebSockets (persistent connection)
- Server can push data to clients instantly
- **Simple analogy**: Like a walkie-talkie that stays connected

### **React Context**
- Way to share data between components without passing props
- **Simple analogy**: Like a shared bulletin board all components can read/write

### **MongoDB**
- NoSQL database (stores data as documents, not tables)
- **Simple analogy**: Like a filing cabinet with folders (collections) and papers (documents)

### **JWT/Token Authentication**
- Instead of sending password every time, server gives you a token
- Token proves you're logged in
- **Simple analogy**: Like a membership card - show it to prove you're a member

---

## 🚀 Summary

This is a full-stack video conferencing app where:
- **Backend** (Node.js/Express) handles authentication, database, and real-time communication
- **Frontend** (React) provides the user interface
- **Socket.IO** enables real-time features (chat, user join/leave)
- **WebRTC** enables peer-to-peer video/audio
- **MongoDB** stores user accounts and meeting history

The app follows a typical MERN stack architecture with real-time capabilities added via Socket.IO and WebRTC.

