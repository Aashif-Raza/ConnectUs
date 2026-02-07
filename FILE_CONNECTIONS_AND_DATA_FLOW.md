# File Connections and Data Flow - Complete Guide

## 📋 Table of Contents
1. [Backend File Connections](#backend-file-connections)
2. [Frontend Component Connections](#frontend-component-connections)
3. [Backend ↔ Frontend Communication](#backend--frontend-communication)
4. [Data Flow Diagrams](#data-flow-diagrams)
5. [Import/Export Map](#importexport-map)
6. [Component Hierarchy](#component-hierarchy)

---

## 🔗 Backend File Connections

### Connection Flow Diagram:
```
app.js (Entry Point)
    ↓
    ├──→ routes/users.routes.js
    │       ↓
    │       └──→ controllers/user.controller.js
    │               ↓
    │               ├──→ models/user.model.js
    │               └──→ models/meeting.model.js
    │
    └──→ controllers/socketManager.js
            ↓
            └──→ (Uses Socket.IO, no direct model imports)
```

### Detailed Connections:

#### 1. **`app.js` → `routes/users.routes.js`**
```javascript
// In app.js
import userRoutes from "./routes/users.routes.js"
app.use("/api/v1/users", userRoutes);
```
**Connection Type**: Route mounting
- **What happens**: All requests to `/api/v1/users/*` are forwarded to `users.routes.js`
- **Data flow**: HTTP requests → Express router → Route handlers

#### 2. **`routes/users.routes.js` → `controllers/user.controller.js`**
```javascript
// In users.routes.js
import { login, register, getUserHistory, addToHistory } from "../controllers/user.controller.js";

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/add_to_activity").post(addToHistory)
router.route("/get_all_activity").get(getUserHistory)
```
**Connection Type**: Function import and route mapping
- **What happens**: 
  - POST `/api/v1/users/login` → calls `login()` function
  - POST `/api/v1/users/register` → calls `register()` function
  - POST `/api/v1/users/add_to_activity` → calls `addToHistory()` function
  - GET `/api/v1/users/get_all_activity` → calls `getUserHistory()` function
- **Data flow**: Route path → Controller function → Response

#### 3. **`controllers/user.controller.js` → `models/user.model.js`**
```javascript
// In user.controller.js
import { User } from "../models/user.model.js";

// Used in login:
const user = await User.findOne({ username });

// Used in register:
const existingUser = await User.findOne({ username });
const newUser = new User({ name, username, password: hashedPassword });
await newUser.save();
```
**Connection Type**: Model import and database operations
- **What happens**: Controller uses User model to:
  - Find users in database
  - Create new users
  - Update user data (like adding tokens)
- **Data flow**: Controller → Model → MongoDB → Model → Controller

#### 4. **`controllers/user.controller.js` → `models/meeting.model.js`**
```javascript
// In user.controller.js
import { Meeting } from "../models/meeting.model.js";

// Used in getUserHistory:
const meetings = await Meeting.find({ user_id: user.username })

// Used in addToHistory:
const newMeeting = new Meeting({
    user_id: user.username,
    meetingCode: meeting_code
})
await newMeeting.save();
```
**Connection Type**: Model import and database operations
- **What happens**: Controller uses Meeting model to:
  - Find all meetings for a user
  - Create new meeting records
- **Data flow**: Controller → Meeting Model → MongoDB → Controller

#### 5. **`app.js` → `controllers/socketManager.js`**
```javascript
// In app.js
import { connectToSocket } from "./controllers/socketManager.js";
const io = connectToSocket(server);
```
**Connection Type**: Function import and initialization
- **What happens**: 
  - `app.js` calls `connectToSocket()` with the HTTP server
  - Returns a Socket.IO server instance
  - Socket.IO server handles all WebSocket connections
- **Data flow**: HTTP Server → Socket Manager → Socket.IO Server → Real-time events

#### 6. **`controllers/socketManager.js` → (No direct model connections)**
**Connection Type**: Standalone real-time handler
- **What happens**: Socket manager maintains in-memory state:
  - `connections = {}` - tracks users in rooms
  - `messages = {}` - stores chat messages
  - `timeOnline = {}` - tracks join times
- **Note**: Socket manager doesn't directly use database models, but could be extended to save chat/meeting data

---

## 🎨 Frontend Component Connections

### Component Hierarchy:
```
index.js (Entry)
    ↓
App.js (Main Router)
    ↓
    ├──→ AuthProvider (Context Wrapper)
    │       ↓
    │       └──→ All child components can access AuthContext
    │
    ├──→ Landing.jsx
    │
    ├──→ Authentication.jsx
    │       ↓ (uses)
    │       └──→ AuthContext (for handleLogin, handleRegister)
    │
    ├──→ Home.jsx
    │       ↓ (wrapped by)
    │       └──→ WithAuth.jsx (authentication guard)
    │               ↓ (uses)
    │               └──→ AuthContext (for addToUserHistory)
    │
    ├──→ History.jsx
    │       ↓ (uses)
    │       └──→ AuthContext (for getHistoryOfUser)
    │
    └──→ VideoMeet.jsx
            ↓ (uses)
            ├──→ environment.js (for server URL)
            └──→ socket.io-client (direct connection to backend)
```

### Detailed Connections:

#### 1. **`index.js` → `App.js`**
```javascript
// In index.js
import App from './App';
root.render(<App />);
```
**Connection Type**: Component rendering
- **What happens**: React renders App component as the root
- **Data flow**: index.js → App.js → All routes

#### 2. **`App.js` → `AuthContext.jsx`**
```javascript
// In App.js
import { AuthProvider } from './contexts/AuthContext';

<AuthProvider>
    <Routes>...</Routes>
</AuthProvider>
```
**Connection Type**: Context Provider wrapper
- **What happens**: 
  - `AuthProvider` wraps all routes
  - Makes authentication functions available to all child components
  - Provides: `handleLogin`, `handleRegister`, `userData`, `getHistoryOfUser`, `addToUserHistory`
- **Data flow**: AuthProvider → Context → All child components

#### 3. **`App.js` → Route Components**
```javascript
// In App.js
<Routes>
    <Route path='/' element={<LandingPage />} />
    <Route path='/auth' element={<Authentication />} />
    <Route path='/home' element={<HomeComponent />} />
    <Route path='/history' element={<History />} />
    <Route path='/:url' element={<VideoMeetComponent />} />
</Routes>
```
**Connection Type**: React Router navigation
- **What happens**: 
  - URL path determines which component renders
  - Navigation happens via `useNavigate()` hook
- **Data flow**: URL change → Router → Component render

#### 4. **`Authentication.jsx` → `AuthContext.jsx`**
```javascript
// In Authentication.jsx
import { AuthContext } from '../contexts/AuthContext';
const { handleRegister, handleLogin } = React.useContext(AuthContext);

// Usage:
let result = await handleLogin(username, password);
let result = await handleRegister(name, username, password);
```
**Connection Type**: Context consumption
- **What happens**: 
  - Component gets login/register functions from context
  - Calls these functions when user submits form
  - Functions make API calls to backend
- **Data flow**: User input → Context function → API call → Backend → Response → UI update

#### 5. **`Home.jsx` → `WithAuth.jsx`**
```javascript
// In Home.jsx (at bottom)
export default withAuth(HomeComponent)

// In WithAuth.jsx
const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
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
**Connection Type**: Higher-Order Component (HOC) wrapper
- **What happens**: 
  - `withAuth` wraps `HomeComponent`
  - Checks if user has token in localStorage
  - If not authenticated, redirects to `/auth`
  - If authenticated, renders `HomeComponent`
- **Data flow**: Component load → Auth check → Render or redirect

#### 6. **`Home.jsx` → `AuthContext.jsx`**
```javascript
// In Home.jsx
import { AuthContext } from '../contexts/AuthContext';
const { addToUserHistory } = useContext(AuthContext);

let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode)
    navigate(`/${meetingCode}`)
}
```
**Connection Type**: Context consumption
- **What happens**: 
  - Gets `addToUserHistory` function from context
  - Saves meeting code to history
  - Navigates to video meeting page
- **Data flow**: User enters code → Context function → API call → Navigate

#### 7. **`History.jsx` → `AuthContext.jsx`**
```javascript
// In History.jsx
import { AuthContext } from '../contexts/AuthContext';
const { getHistoryOfUser } = useContext(AuthContext);

useEffect(() => {
    const fetchHistory = async () => {
        const history = await getHistoryOfUser();
        setMeetings(history);
    }
    fetchHistory();
}, [])
```
**Connection Type**: Context consumption with useEffect
- **What happens**: 
  - On component mount, calls `getHistoryOfUser()`
  - Fetches meeting history from backend
  - Updates state with meetings
  - Renders meeting cards
- **Data flow**: Component mount → Context function → API call → Backend → State update → Render

#### 8. **`VideoMeet.jsx` → `environment.js`**
```javascript
// In VideoMeet.jsx
import server from '../environment';
const server_url = server;

// Usage:
socketRef.current = io.connect(server_url, { secure: false })
```
**Connection Type**: Configuration import
- **What happens**: 
  - Gets server URL from environment file
  - Uses it to connect Socket.IO client to backend
- **Data flow**: Import → Use in Socket.IO connection

#### 9. **`VideoMeet.jsx` → `socket.io-client` (Direct Backend Connection)**
```javascript
// In VideoMeet.jsx
import io from "socket.io-client";

socketRef.current = io.connect(server_url, { secure: false })
socketRef.current.emit('join-call', window.location.href)
socketRef.current.on('user-joined', (id, clients) => { ... })
socketRef.current.on('chat-message', addMessage)
```
**Connection Type**: Direct WebSocket connection
- **What happens**: 
  - Creates direct Socket.IO connection to backend
  - Sends events: `join-call`, `signal`, `chat-message`
  - Receives events: `user-joined`, `user-left`, `chat-message`, `signal`
- **Data flow**: Component → Socket.IO Client → Backend Socket.IO Server → Other clients

#### 10. **`AuthContext.jsx` → `axios` → Backend API**
```javascript
// In AuthContext.jsx
import axios from "axios";
const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
});

// Functions make HTTP requests:
const request = await client.post("/register", { name, username, password });
const request = await client.post("/login", { username, password });
```
**Connection Type**: HTTP client to backend
- **What happens**: 
  - Creates axios instance with base URL
  - Makes POST/GET requests to backend routes
  - Handles responses and errors
- **Data flow**: Context function → Axios → HTTP Request → Backend → Response → Context → Component

---

## 🔄 Backend ↔ Frontend Communication

### HTTP API Communication (REST):

```
Frontend Component
    ↓ (calls function)
AuthContext.jsx
    ↓ (axios.post/get)
HTTP Request
    ↓
Backend app.js (Express)
    ↓ (routes to)
users.routes.js
    ↓ (calls)
user.controller.js
    ↓ (uses)
User/Meeting Model
    ↓ (queries)
MongoDB Database
    ↓ (returns data)
user.controller.js
    ↓ (sends response)
HTTP Response
    ↓
AuthContext.jsx
    ↓ (updates state)
Frontend Component (re-renders)
```

### Real-time Communication (WebSocket):

```
Frontend VideoMeet.jsx
    ↓ (socket.io-client)
Socket.IO Client Connection
    ↓ (WebSocket)
Backend socketManager.js
    ↓ (Socket.IO Server)
    ├──→ Other Client 1
    ├──→ Other Client 2
    └──→ Other Client 3
```

### Complete Data Flow Examples:

#### Example 1: User Registration
```
1. User fills form in Authentication.jsx
   ↓
2. Clicks "Register" button
   ↓
3. Calls handleRegister() from AuthContext
   ↓
4. AuthContext makes: POST /api/v1/users/register
   ↓
5. Backend app.js receives request
   ↓
6. Routes to users.routes.js → register route
   ↓
7. Calls register() in user.controller.js
   ↓
8. Controller uses User model to check if username exists
   ↓
9. Hashes password with bcrypt
   ↓
10. Creates new User document
   ↓
11. Saves to MongoDB
   ↓
12. Returns success response
   ↓
13. AuthContext receives response
   ↓
14. Shows success message in Authentication.jsx
```

#### Example 2: Joining a Video Meeting
```
1. User enters meeting code in Home.jsx
   ↓
2. Clicks "Join" button
   ↓
3. Calls addToUserHistory() from AuthContext
   ↓
4. AuthContext makes: POST /api/v1/users/add_to_activity
   ↓
5. Backend saves meeting to history
   ↓
6. Frontend navigates to /{meetingCode}
   ↓
7. VideoMeet.jsx component loads
   ↓
8. User enters username
   ↓
9. Requests camera/mic permissions
   ↓
10. Connects to Socket.IO server
   ↓
11. Emits 'join-call' event with meeting URL
   ↓
12. Backend socketManager.js receives event
   ↓
13. Adds socket.id to connections[meetingCode]
   ↓
14. Emits 'user-joined' to all users in room
   ↓
15. Each client creates WebRTC peer connections
   ↓
16. Exchanges SDP offers/answers via 'signal' events
   ↓
17. Video streams connect peer-to-peer
   ↓
18. Users can see/hear each other
```

#### Example 3: Sending a Chat Message
```
1. User types message in VideoMeet.jsx
   ↓
2. Clicks "Send" button
   ↓
3. Calls sendMessage() function
   ↓
4. Emits 'chat-message' event via Socket.IO
   ↓
5. Backend socketManager.js receives event
   ↓
6. Finds which room user is in (from connections)
   ↓
7. Saves message to messages[room] array
   ↓
8. Broadcasts 'chat-message' to all users in room
   ↓
9. All connected clients receive event
   ↓
10. Each VideoMeet.jsx calls addMessage()
   ↓
11. Updates messages state
   ↓
12. UI re-renders with new message
```

---

## 📊 Import/Export Map

### Backend Imports:

#### `app.js` imports:
- `express` (external)
- `createServer` from `node:http` (built-in)
- `Server` from `socket.io` (external)
- `mongoose` (external)
- `connectToSocket` from `./controllers/socketManager.js` (local)
- `cors` (external)
- `userRoutes` from `./routes/users.routes.js` (local)

#### `routes/users.routes.js` imports:
- `Router` from `express` (external)
- `login, register, getUserHistory, addToHistory` from `../controllers/user.controller.js` (local)

#### `controllers/user.controller.js` imports:
- `httpStatus` (external)
- `User` from `../models/user.model.js` (local)
- `bcrypt` (external)
- `crypto` (external)
- `Meeting` from `../models/meeting.model.js` (local)

#### `models/user.model.js` imports:
- `mongoose, Schema` from `mongoose` (external)

#### `models/meeting.model.js` imports:
- `mongoose, Schema` from `mongoose` (external)

#### `controllers/socketManager.js` imports:
- `Server` from `socket.io` (external)

### Frontend Imports:

#### `index.js` imports:
- `React` from `react` (external)
- `ReactDOM` from `react-dom/client` (external)
- `./index.css` (local)
- `App` from `./App` (local)
- `reportWebVitals` from `./reportWebVitals` (local)

#### `App.js` imports:
- `./App.css` (local)
- `Route, BrowserRouter, Routes` from `react-router-dom` (external)
- `LandingPage` from `./pages/Landing` (local)
- `Authentication` from `./pages/Authentication` (local)
- `AuthProvider` from `./contexts/AuthContext` (local)
- `VideoMeetComponent` from `./pages/VideoMeet` (local)
- `HomeComponent` from `./pages/Home` (local)
- `History` from `./pages/History` (local)

#### `contexts/AuthContext.jsx` imports:
- `axios` (external)
- `createContext, useState` from `react` (external)
- `useNavigate` from `react-router-dom` (external)

#### `pages/Authentication.jsx` imports:
- React components from `@mui/material` (external)
- `AuthContext` from `../contexts/AuthContext` (local)

#### `pages/Home.jsx` imports:
- `React, useContext, useState` from `react` (external)
- `withAuth` from `../utils/WithAuth` (local)
- `useNavigate` from `react-router-dom` (external)
- `./App.css` (local)
- Components from `@mui/material` (external)
- `AuthContext` from `../contexts/AuthContext` (local)

#### `pages/VideoMeet.jsx` imports:
- `React, useEffect, useRef, useState` from `react` (external)
- `io` from `socket.io-client` (external)
- Components from `@mui/material` (external)
- `../styles/videoComponent.module.css` (local)
- `server` from `../environment` (local)

#### `pages/History.jsx` imports:
- `React, useContext, useEffect, useState` from `react` (external)
- `AuthContext` from `../contexts/AuthContext` (local)
- `useNavigate` from `react-router-dom` (external)
- Components from `@mui/material` (external)

#### `utils/WithAuth.jsx` imports:
- `useEffect` from `react` (external)
- `useNavigate` from `react-router-dom` (external)

#### `environment.js` imports:
- None (just exports server URL)

---

## 🌳 Component Hierarchy Tree

```
index.js
└── App.js
    └── Router
        └── AuthProvider (Context)
            ├── Route: "/" → Landing.jsx
            │
            ├── Route: "/auth" → Authentication.jsx
            │   └── (uses) AuthContext
            │
            ├── Route: "/home" → withAuth(HomeComponent)
            │   ├── WithAuth.jsx (HOC)
            │   │   └── (checks) localStorage token
            │   └── HomeComponent.jsx
            │       └── (uses) AuthContext
            │
            ├── Route: "/history" → History.jsx
            │   └── (uses) AuthContext
            │
            └── Route: "/:url" → VideoMeet.jsx
                ├── (uses) environment.js
                └── (connects) socket.io-client → Backend socketManager.js
```

---

## 🔄 State Management Flow

### Global State (via Context):
```
AuthContext.jsx
    ├── userData (user information)
    ├── setUserData (update user)
    ├── handleLogin (login function)
    ├── handleRegister (register function)
    ├── getHistoryOfUser (fetch history)
    └── addToUserHistory (save meeting)
        ↓ (accessible to)
    ├── Authentication.jsx
    ├── Home.jsx
    └── History.jsx
```

### Local State (Component-level):
```
VideoMeet.jsx
    ├── videoAvailable (camera permission)
    ├── audioAvailable (mic permission)
    ├── video (video on/off)
    ├── audio (audio on/off)
    ├── screen (screen share on/off)
    ├── videos (remote video streams)
    ├── messages (chat messages)
    ├── message (current message input)
    ├── username (user's name)
    └── askForUsername (show username input)
```

### Backend State (In-memory):
```
socketManager.js
    ├── connections = {} (users in rooms)
    ├── messages = {} (chat history per room)
    └── timeOnline = {} (join times)
```

---

## 🎯 Key Connection Patterns

### 1. **Context Pattern** (Frontend)
- **Purpose**: Share data/functions across components
- **Files**: `AuthContext.jsx` → All page components
- **Flow**: Provider wraps components → Components consume via `useContext()`

### 2. **Higher-Order Component Pattern** (Frontend)
- **Purpose**: Add authentication check to components
- **Files**: `WithAuth.jsx` → `Home.jsx`
- **Flow**: Wraps component → Checks auth → Renders or redirects

### 3. **Route Pattern** (Frontend)
- **Purpose**: Navigate between pages
- **Files**: `App.js` → All page components
- **Flow**: URL change → Router → Component render

### 4. **MVC Pattern** (Backend)
- **Purpose**: Separate concerns
- **Files**: `routes/` → `controllers/` → `models/`
- **Flow**: Route → Controller → Model → Database

### 5. **Event-Driven Pattern** (Real-time)
- **Purpose**: Real-time communication
- **Files**: `VideoMeet.jsx` ↔ `socketManager.js`
- **Flow**: Component emits event → Server receives → Server broadcasts → All clients receive

### 6. **REST API Pattern** (HTTP)
- **Purpose**: Standard HTTP communication
- **Files**: `AuthContext.jsx` → `user.routes.js` → `user.controller.js`
- **Flow**: HTTP request → Route → Controller → Model → Response

---

## 📝 Summary of Connections

### Backend:
- **app.js** is the central hub that connects routes and socket manager
- **routes/** files map URLs to controller functions
- **controllers/** contain business logic and use models
- **models/** define database schemas
- **socketManager.js** handles real-time events independently

### Frontend:
- **index.js** renders App.js as root
- **App.js** sets up routing and wraps everything in AuthProvider
- **AuthContext.jsx** provides shared authentication functions
- **Page components** consume context and make API calls
- **VideoMeet.jsx** has direct Socket.IO connection for real-time features
- **WithAuth.jsx** protects routes that require authentication

### Communication:
- **HTTP**: Frontend (axios) → Backend (Express routes) → Database
- **WebSocket**: Frontend (socket.io-client) ↔ Backend (socket.io server) ↔ All clients
- **Context**: AuthProvider → All child components (via React Context)

This architecture ensures:
- ✅ Separation of concerns
- ✅ Reusable authentication logic
- ✅ Real-time capabilities
- ✅ Protected routes
- ✅ Clean data flow

