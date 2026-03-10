# ConnectUs

A full-stack video conferencing application built with the MERN stack and WebRTC. Start an instant meeting, invite anyone with a link, and communicate through HD video, audio, and live chat — all in the browser, no downloads required.

---

## Live Preview

> Start the backend and frontend locally using the steps below.

---

## Features

- **Instant Video Rooms** — Create or join a meeting with a single code
- **WebRTC Peer-to-Peer Video & Audio** — Low-latency, direct browser-to-browser calls
- **Screen Sharing** — Share your screen with all participants
- **Live In-Meeting Chat** — Real-time text messaging with Socket.IO
- **Participants Panel** — See who's in the call at a glance
- **Join/Leave Notifications** — Snackbar alerts when users enter or exit
- **Copy Meeting Link** — One-click clipboard copy of the meeting URL
- **Meeting History** — Authenticated users can view past meetings
- **Authentication** — Register and login with JWT-secured sessions
- **Guest Access** — Join any meeting without an account
- **Black & White Editorial UI** — Clean, professional, fully responsive design
- **Mobile Responsive** — Hamburger nav, stacked layouts, touch-friendly targets

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Material UI v7 | Component library |
| Socket.IO Client | Real-time signalling |
| WebRTC (native) | Peer-to-peer video/audio |
| Axios | HTTP client |
| CSS Modules | Scoped component styles |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js ≥ 18 | Runtime |
| Express 5 | HTTP server |
| Socket.IO | WebRTC signalling & chat relay |
| MongoDB + Mongoose | Database & ODM |
| bcrypt | Password hashing |
| JSON Web Tokens | Auth tokens |

---

## Project Structure

```
ConnectUS/
├── frontend/                  # React app
│   ├── public/
│   │   ├── index.html
│   │   └── hero.png
│   ├── src/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Auth state & API calls
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Public landing page
│   │   │   ├── Authentication.jsx   # Login / Register
│   │   │   ├── Home.jsx             # Dashboard (protected)
│   │   │   ├── History.jsx          # Meeting history (protected)
│   │   │   ├── VideoMeet.jsx        # Video call room
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── styles/
│   │   │   ├── landing.css
│   │   │   ├── videoComponent.module.css
│   │   │   └── notfound.css
│   │   ├── utils/
│   │   │   └── WithAuth.jsx         # Auth HOC for protected routes
│   │   ├── environment.js           # Server URL config (reads from .env)
│   │   ├── App.js                   # Routes
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
└── backend/                   # Node/Express API
    ├── src/
    │   ├── controllers/
    │   │   ├── socketManager.js     # Socket.IO + WebRTC signalling
    │   │   └── user.controller.js   # Auth & history logic
    │   ├── models/                  # Mongoose schemas
    │   ├── routes/
    │   │   └── users.routes.js
    │   └── app.js                   # Server entry point
    ├── .env.example
    └── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9
- A **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### 1. Clone the repository

```bash
git clone https://github.com/Aashif-Raza/ConnectUs.git
cd ConnectUs
```

---

### 2. Set up the Backend

```bash
cd backend
```

Create your environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
```

Install dependencies and start:

```bash
npm install
npm run dev     # development (nodemon)
# or
npm start       # production
```

The backend will be available at `http://localhost:8000`.

---

### 3. Set up the Frontend

```bash
cd frontend
```

Create your environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_SERVER_URL=http://localhost:8000
```

Install dependencies and start:

```bash
npm install
npm start
```

The app will open at `http://localhost:3000`.

---

## Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_SERVER_URL` | Full URL of the backend server | `http://localhost:8000` |

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | ✅ Yes |
| `PORT` | Port the server listens on | Default: `8000` |

> ⚠️ Never commit `.env` files with real credentials. They are in `.gitignore`.

---

## How It Works

### Authentication Flow

1. User registers or logs in via `/auth`
2. Backend hashes password with **bcrypt** and issues a **JWT token**
3. Token stored in `localStorage` and sent with every authenticated API request
4. `withAuth` HOC redirects unauthenticated users to `/auth`

### Video Call Flow

```
User A opens /:meetingCode
    → Enters lobby (camera/mic preview)
    → Types display name → clicks "Join Meeting"
    → Frontend connects to Socket.IO server
    → Emits "join-call" with the meeting URL and username

Socket.IO server
    → Adds socket to the room
    → Broadcasts "user-joined" to all existing participants

All participants
    → Create RTCPeerConnection for each new socket
    → Exchange SDP offer/answer via "signal" events (relayed by server)
    → Exchange ICE candidates via "signal" events
    → Peer-to-peer video/audio stream established ← no server in the media path
```

### Chat

Chat messages are sent to the Socket.IO server which **broadcasts** them to everyone in the same room. Message history is kept in memory for the duration of the meeting.

---

## API Endpoints

Base URL: `/api/v1/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | No | Create a new account |
| `POST` | `/login` | No | Login, returns JWT token |
| `POST` | `/add_to_activity` | Token | Save a meeting to history |
| `GET` | `/get_all_activity` | Token | Fetch meeting history |

---

## Scripts

### Frontend

```bash
npm start        # Start development server (port 3000)
npm run build    # Create optimised production build
npm test         # Run test suite
```

### Backend

```bash
npm run dev      # Start with nodemon (auto-restart on changes)
npm start        # Start without nodemon
```

---

## Deployment Notes

- **Frontend**: Deploy the `frontend/build` output to any static host (Vercel, Netlify, GitHub Pages)
- **Backend**: Deploy to any Node.js host (Render, Railway, Heroku, DigitalOcean). Set `MONGO_URI` and `PORT` as environment variables on the platform.
- **CORS**: The backend currently allows all origins (`*`). For production, restrict `origin` in `socketManager.js` to your frontend domain.

---

## Author

**Md Aashif Raza**  
[GitHub](https://github.com/Aashif-Raza)

---

## License

MIT
