# Visual Connection Diagrams

## 🔄 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                              │
│  │   index.js   │  (Entry Point)                               │
│  └──────┬───────┘                                              │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                              │
│  │    App.js    │  (Router + AuthProvider)                     │
│  └──────┬───────┘                                              │
│         │                                                       │
│         ├─── Landing.jsx                                        │
│         ├─── Authentication.jsx ──┐                             │
│         ├─── Home.jsx ────────────┼───┐                        │
│         ├─── History.jsx ─────────┼───┼───┐                    │
│         └─── VideoMeet.jsx ──────┼───┼───┼───┐                │
│                                   │   │   │   │                │
│  ┌────────────────────────────────┘   │   │   │                │
│  │  AuthContext.jsx                    │   │   │                │
│  │  (Provides: handleLogin,              │   │   │                │
│  │   handleRegister, getHistory, etc.)  │   │   │                │
│  └──────────────────────────────────────┘   │   │                │
│                                              │   │                │
│  ┌───────────────────────────────────────────┘   │                │
│  │  WithAuth.jsx (HOC)                          │                │
│  │  (Protects Home.jsx)                          │                │
│  └───────────────────────────────────────────────┘                │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────────┘
│  │  socket.io-client (Direct Connection)
│  │  environment.js (Server URL)
│  └───────────────────────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP (REST API)
                            │ WebSocket (Socket.IO)
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                              │
│  │   app.js     │  (Main Server)                               │
│  └───┬──────┬───┘                                              │
│      │      │                                                   │
│      │      └───► socketManager.js                             │
│      │            (Real-time Events)                           │
│      │                                                           │
│      └───► users.routes.js                                     │
│            │                                                    │
│            └───► user.controller.js                              │
│                  │                                               │
│                  ├───► user.model.js ──┐                        │
│                  └───► meeting.model.js│                        │
│                                        │                        │
│  ┌─────────────────────────────────────┘                        │
│  │  MongoDB Database                                            │
│  │  - Users Collection                                          │
│  │  - Meetings Collection                                       │
│  └──────────────────────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────┘
```

---

## 📡 Data Flow: User Registration

```
┌─────────────────┐
│ Authentication  │
│    .jsx         │
│  (User Form)    │
└────────┬────────┘
         │
         │ 1. User clicks "Register"
         │    handleRegister(name, username, password)
         ▼
┌─────────────────┐
│  AuthContext    │
│    .jsx         │
└────────┬────────┘
         │
         │ 2. axios.post("/register", {...})
         │    HTTP POST Request
         ▼
┌─────────────────┐
│    app.js      │
│  (Express)      │
└────────┬────────┘
         │
         │ 3. Routes to /api/v1/users/register
         ▼
┌─────────────────┐
│ users.routes   │
│    .js          │
└────────┬────────┘
         │
         │ 4. Calls register() function
         ▼
┌─────────────────┐
│ user.controller│
│    .js         │
└────────┬────────┘
         │
         │ 5. Check if user exists
         │    Hash password
         │    Create new User
         ▼
┌─────────────────┐
│  user.model    │
│    .js         │
└────────┬────────┘
         │
         │ 6. Save to database
         ▼
┌─────────────────┐
│    MongoDB      │
│   Database      │
└────────┬────────┘
         │
         │ 7. Success Response
         │    HTTP 201 Created
         ▼
┌─────────────────┐
│  AuthContext   │
│    .jsx        │
└────────┬────────┘
         │
         │ 8. Update UI
         │    Show success message
         ▼
┌─────────────────┐
│ Authentication  │
│    .jsx         │
│  (Success UI)   │
└─────────────────┘
```

---

## 🎥 Data Flow: Joining Video Meeting

```
┌─────────────────┐
│    Home.jsx     │
│  (Enter Code)   │
└────────┬────────┘
         │
         │ 1. User enters meeting code
         │    Clicks "Join"
         │    addToUserHistory(meetingCode)
         ▼
┌─────────────────┐
│  AuthContext    │
│    .jsx         │
└────────┬────────┘
         │
         │ 2. POST /api/v1/users/add_to_activity
         │    Save to database
         │    Navigate to /{meetingCode}
         ▼
┌─────────────────┐
│ VideoMeet.jsx   │
│  (Video Call)   │
└────────┬────────┘
         │
         │ 3. User enters username
         │    Request camera/mic permissions
         │    getPermissions()
         ▼
┌─────────────────┐
│  Browser API    │
│  (getUserMedia) │
└────────┬────────┘
         │
         │ 4. Local video stream ready
         │    Connect to Socket.IO
         │    io.connect(server_url)
         ▼
┌─────────────────┐
│ socket.io-client│
│  (Frontend)     │
└────────┬────────┘
         │
         │ 5. WebSocket Connection
         │    emit('join-call', meetingURL)
         ▼
┌─────────────────┐
│ socketManager   │
│    .js          │
│  (Backend)      │
└────────┬────────┘
         │
         │ 6. Add socket.id to connections[room]
         │    emit('user-joined') to all in room
         ▼
┌─────────────────┐
│ All Clients     │
│ (Other Users)   │
└────────┬────────┘
         │
         │ 7. Create WebRTC Peer Connections
         │    Exchange SDP offers/answers
         │    Exchange ICE candidates
         ▼
┌─────────────────┐
│  Video Streams  │
│  (Peer-to-Peer) │
└─────────────────┘
```

---

## 💬 Data Flow: Chat Message

```
┌─────────────────┐
│  VideoMeet.jsx  │
│  (User A)       │
└────────┬────────┘
         │
         │ 1. User types message
         │    Clicks "Send"
         │    sendMessage()
         ▼
┌─────────────────┐
│ socket.io-client│
│  (Client A)     │
└────────┬────────┘
         │
         │ 2. emit('chat-message', message, username)
         │    WebSocket Event
         ▼
┌─────────────────┐
│ socketManager   │
│    .js          │
│  (Backend)      │
└────────┬────────┘
         │
         │ 3. Find which room user is in
         │    Save to messages[room] array
         │    Broadcast to all in room
         ▼
┌─────────────────┐
│ socket.io-client│
│  (All Clients)  │
└────────┬────────┘
         │
         │ 4. on('chat-message') event received
         │    addMessage(data, sender)
         ▼
┌─────────────────┐
│  VideoMeet.jsx  │
│  (All Users)    │
│  (UI Updates)   │
└─────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────────┐
│ Authentication  │
│    .jsx         │
└────────┬────────┘
         │
         │ 1. User enters credentials
         │    handleLogin(username, password)
         ▼
┌─────────────────┐
│  AuthContext    │
│    .jsx         │
└────────┬────────┘
         │
         │ 2. POST /api/v1/users/login
         │    { username, password }
         ▼
┌─────────────────┐
│ user.controller │
│    .js          │
└────────┬────────┘
         │
         │ 3. Find user in database
         │    Compare password (bcrypt)
         │    Generate token (crypto)
         │    Save token to user
         ▼
┌─────────────────┐
│    MongoDB      │
│   (User saved)  │
└────────┬────────┘
         │
         │ 4. Return { token: "..." }
         │    HTTP 200 OK
         ▼
┌─────────────────┐
│  AuthContext    │
│    .jsx         │
└────────┬────────┘
         │
         │ 5. localStorage.setItem("token", token)
         │    navigate("/home")
         ▼
┌─────────────────┐
│    Home.jsx     │
│  (Protected)    │
└─────────────────┘
```

---

## 🛡️ Route Protection Flow

```
┌─────────────────┐
│  User navigates │
│  to /home       │
└────────┬────────┘
         │
         │ 1. Route matches /home
         │    Component: withAuth(HomeComponent)
         ▼
┌─────────────────┐
│   WithAuth.jsx  │
│   (HOC)         │
└────────┬────────┘
         │
         │ 2. useEffect runs
         │    isAuthenticated()
         │    Checks localStorage.getItem("token")
         │
         ├─── Token exists? ──┐
         │                     │
         │  YES                │  NO
         │  │                  │
         │  ▼                  ▼
         │  ┌──────────┐   ┌──────────┐
         │  │ Render   │   │ Redirect │
         │  │ Home     │   │ to /auth │
         │  │ Component│   │          │
         │  └──────────┘   └──────────┘
         │
         ▼
┌─────────────────┐
│  HomeComponent  │
│    .jsx         │
│  (Rendered)     │
└─────────────────┘
```

---

## 🔌 Socket.IO Event Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (VideoMeet.jsx)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  socket.on('connect')                                        │
│    └─► emit('join-call', meetingURL)                        │
│                                                              │
│  socket.on('user-joined', (id, clients))                    │
│    └─► Create RTCPeerConnection for each client              │
│    └─► Exchange SDP offers/answers                          │
│                                                              │
│  socket.on('signal', (fromId, message))                      │
│    └─► Handle WebRTC signaling                              │
│                                                              │
│  socket.emit('chat-message', message, username)            │
│                                                              │
│  socket.on('chat-message', (data, sender))                  │
│    └─► Display message in chat                              │
│                                                              │
│  socket.on('user-left', (id))                               │
│    └─► Remove user's video                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ WebSocket
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              SERVER (socketManager.js)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  io.on('connection', (socket))                               │
│    └─► socket.on('join-call', (path))                       │
│        └─► Add to connections[path]                         │
│        └─► Emit 'user-joined' to all                        │
│                                                              │
│    └─► socket.on('signal', (toId, message))                 │
│        └─► Forward to target user                           │
│                                                              │
│    └─► socket.on('chat-message', (data, sender))            │
│        └─► Save to messages[room]                          │
│        └─► Broadcast to all in room                         │
│                                                              │
│    └─► socket.on('disconnect')                                │
│        └─► Remove from connections                          │
│        └─► Emit 'user-left' to all                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Module Dependency Graph

### Backend:
```
app.js
├── express
├── node:http
├── socket.io
├── mongoose
├── cors
├── ./controllers/socketManager.js
│   └── socket.io
└── ./routes/users.routes.js
    └── ./controllers/user.controller.js
        ├── http-status
        ├── bcrypt
        ├── crypto
        ├── ../models/user.model.js
        │   └── mongoose
        └── ../models/meeting.model.js
            └── mongoose
```

### Frontend:
```
index.js
├── react
├── react-dom
└── ./App.js
    ├── react-router-dom
    ├── ./contexts/AuthContext.jsx
    │   ├── react
    │   ├── react-router-dom
    │   └── axios
    ├── ./pages/Landing.jsx
    ├── ./pages/Authentication.jsx
    │   ├── @mui/material
    │   └── ../contexts/AuthContext.jsx
    ├── ./pages/Home.jsx
    │   ├── react
    │   ├── react-router-dom
    │   ├── @mui/material
    │   ├── ../contexts/AuthContext.jsx
    │   └── ../utils/WithAuth.jsx
    │       ├── react
    │       └── react-router-dom
    ├── ./pages/History.jsx
    │   ├── react
    │   ├── @mui/material
    │   └── ../contexts/AuthContext.jsx
    └── ./pages/VideoMeet.jsx
        ├── react
        ├── socket.io-client
        ├── @mui/material
        ├── ../styles/videoComponent.module.css
        └── ../environment.js
```

---

## 🎯 Component Communication Patterns

### Pattern 1: Context Provider
```
AuthProvider (Wrapper)
    │
    ├─── Provides: handleLogin, handleRegister, etc.
    │
    ├─── Authentication.jsx ──┐
    ├─── Home.jsx ────────────┼─── Consume via useContext()
    └─── History.jsx ─────────┘
```

### Pattern 2: Higher-Order Component
```
withAuth() Function
    │
    └─── Wraps: HomeComponent
         │
         ├─── Checks: localStorage token
         │
         ├─── If authenticated: Render HomeComponent
         └─── If not: Redirect to /auth
```

### Pattern 3: Direct Socket Connection
```
VideoMeet.jsx
    │
    └─── socket.io-client
         │
         └─── Direct WebSocket ──► socketManager.js
              (No intermediate layers)
```

### Pattern 4: REST API via Context
```
Page Component
    │
    └─── AuthContext
         │
         └─── axios
              │
              └─── HTTP Request ──► Express Route ──► Controller
```

---

## 🔄 State Synchronization

### Frontend State:
```
AuthContext State
    ├── userData ──► Shared across all components
    └── Functions ──► handleLogin, handleRegister, etc.
         │
         └─── Updates localStorage
              │
              └─── Persists across page refreshes
```

### Backend State:
```
socketManager State (In-Memory)
    ├── connections = {} ──► Active users per room
    ├── messages = {} ──► Chat history per room
    └── timeOnline = {} ──► Join timestamps
         │
         └─── Lost on server restart (not persisted)
```

### Database State:
```
MongoDB (Persistent)
    ├── Users Collection ──► User accounts
    └── Meetings Collection ──► Meeting history
         │
         └─── Persists across server restarts
```

---

## 📊 Request/Response Cycle

### HTTP Request Cycle:
```
Client Request
    │
    ├─── Method: POST/GET
    ├─── URL: /api/v1/users/login
    ├─── Headers: Content-Type, etc.
    └─── Body: { username, password }
         │
         ▼
Express Middleware
    ├─── cors() ──► Allows cross-origin
    ├─── express.json() ──► Parses JSON body
    └─── express.urlencoded() ──► Parses form data
         │
         ▼
Route Handler
    └─── Matches URL pattern
         │
         ▼
Controller Function
    └─── Business logic
         │
         ▼
Model/Database
    └─── Query/Update data
         │
         ▼
Response
    ├─── Status Code: 200, 201, 400, etc.
    ├─── Headers: Content-Type, etc.
    └─── Body: { token, message, data }
         │
         ▼
Client Receives Response
    └─── Updates UI/State
```

### WebSocket Event Cycle:
```
Client Emits Event
    │
    ├─── Event Name: 'join-call'
    └─── Data: meetingURL
         │
         ▼
Socket.IO Server Receives
    │
    └─── socket.on('join-call', handler)
         │
         ▼
Server Processes
    ├─── Updates connections object
    └─── Emits to other clients
         │
         ▼
Other Clients Receive
    └─── socket.on('user-joined', handler)
         │
         ▼
Client Updates UI
    └─── Creates peer connections, etc.
```

---

These diagrams show how every part of your application connects and communicates with each other!

