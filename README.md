# ConnectUS - Video Conferencing Application

A full-stack MERN (MongoDB, Express, React, Node.js) video conferencing application that enables users to create and join video meetings with real-time chat, screen sharing, and meeting history.

## Features

- **User Authentication**: Secure registration and login system with password hashing
- **Real-time Video Calling**: Peer-to-peer video conferencing using WebRTC
- **Meeting Management**: Create, join, and track meetings with unique meeting codes
- **Live Chat**: Send and receive messages during video calls
- **Screen Sharing**: Share your screen with other participants
- **Meeting History**: View and manage your past meetings
- **Guest Access**: Join meetings without creating an account
- **Responsive Design**: Beautiful Material-UI interface that works on all devices

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework for building APIs
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database for user and meeting data
- **Bcrypt** - Password hashing and encryption
- **CORS** - Cross-origin request handling

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication client
- **Material-UI (MUI)** - Component library with pre-built UI elements
- **Axios** - HTTP client for API requests
- **WebRTC** - Peer-to-peer video/audio communication

## Prerequisites

Before you begin, make sure you have installed:
- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB (local or cloud instance)
- Git

## Project Structure

```
ConnectUS/
├── backend/                 # Node.js/Express server
│   ├── src/
│   │   ├── app.js          # Main server file
│   │   ├── models/         # Database schemas
│   │   ├── controllers/    # Business logic
│   │   └── routes/         # API endpoints
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── components/    # Reusable components
│   │   └── App.js         # Main app component
│   └── package.json
├── CODE_EXPLANATION.md    # Detailed code documentation
├── DEPENDENCIES_QUICK_REFERENCE.md
├── CONNECTION_DIAGRAMS.md
└── FILE_CONNECTIONS_AND_DATA_FLOW.md
```

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ConnectUS
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the backend directory:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/connectus
PORT=8000
NODE_ENV=development
```

Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm start
```

The frontend will open on `http://localhost:3000`

## API Endpoints

### Authentication Routes
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users/get_all_activity` - Get meeting history
- `POST /api/v1/users/add_to_activity` - Add meeting to history

## Socket Events

### Client → Server
- `join-call` - Join a meeting room
- `signal` - Send WebRTC signal data
- `chat-message` - Send chat message
- `disconnect` - Leave meeting

### Server → Client
- `user-joined` - Notify when user joins
- `user-left` - Notify when user leaves
- `signal` - Receive WebRTC signal data
- `chat-message` - Receive chat message

## How to Use

1. **Sign Up / Login**
   - Visit the landing page and click "Register" or "Login"
   - Create an account with name, username, and password

2. **Create/Join a Meeting**
   - Navigate to the home page after login
   - Enter a meeting code or generate a new one
   - Click "Join Meeting"

3. **During a Call**
   - Enable/disable video and audio using the controls
   - Share your screen using the screen share button
   - Send messages using the chat interface
   - Invite others by sharing the meeting code

4. **Meeting History**
   - Go to "History" page to view your past meetings
   - All meetings are automatically saved

## Configuration

### Environment Variables

**Backend (.env)**
```
MONGO_URI=<MongoDB connection string>
PORT=8000
NODE_ENV=development
```

**Frontend (environment.js)**
```
const server = "http://localhost:8000"
```

## Running in Production

### Backend
```bash
cd backend
npm install
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build
npm start
```

## Documentation

For detailed information about the project, please refer to:
- [CODE_EXPLANATION.md](./CODE_EXPLANATION.md) - Comprehensive code documentation
- [DEPENDENCIES_QUICK_REFERENCE.md](./DEPENDENCIES_QUICK_REFERENCE.md) - Package dependencies explained
- [CONNECTION_DIAGRAMS.md](./CONNECTION_DIAGRAMS.md) - Architecture and data flow diagrams
- [FILE_CONNECTIONS_AND_DATA_FLOW.md](./FILE_CONNECTIONS_AND_DATA_FLOW.md) - File relationships and data flow

## WebRTC & Socket.IO

This application uses:
- **WebRTC** for peer-to-peer video/audio communication
- **Socket.IO** for real-time signaling and chat communication

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest with WebRTC support)

## Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check that port 8000 is not in use
- Verify MONGO_URI in .env file

### Frontend connection issues
- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify firewall settings allow WebSocket connections

### Video/Audio not working
- Check browser permissions for camera/microphone
- Ensure your device has camera and microphone
- Try a different browser

### Socket connection fails
- Verify backend server is running
- Check network connectivity
- Ensure firewall allows WebSocket connections

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Author

Created as a major project for MERN Stack development.

## Support

For issues or questions, please open an issue on the repository or contact the development team.

---

**Happy Conferencing! 🎥**
