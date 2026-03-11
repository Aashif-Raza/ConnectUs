import React, { useEffect, useRef, useState, useCallback } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Snackbar } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PeopleIcon from '@mui/icons-material/People';
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
};

export default function VideoMeetComponent() {
    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(false); // Fix: Start with chat closed
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    const videoRef = useRef([]);
    let [videos, setVideos] = useState([]);
    let [snackbarMessage, setSnackbarMessage] = useState("");
    let [openSnackbar, setOpenSnackbar] = useState(false);
    let [participants, setParticipants] = useState([]);
    let [showParticipants, setShowParticipants] = useState(false);

    // ── Media Permissions ─────────────────────────────────────
    // CRITICAL FIX: [] dep array — only runs once on mount
    useEffect(() => {
        getPermissions();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoAvailable(!!videoPermission);

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioAvailable(!!audioPermission);

            setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

            if (videoPermission || audioPermission) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({
                    video: !!videoPermission,
                    audio: !!audioPermission,
                });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            // Permission denied — continue with no media
        }
    };

    // ── Screen Share ──────────────────────────────────────────
    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .catch(() => { setScreen(false); });
            }
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio]); // eslint-disable-line react-hooks/exhaustive-deps

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    };

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch { /* stream may not exist yet */ }

        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                    })
                    .catch(() => { });
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                localVideoref.current.srcObject.getTracks().forEach(t => t.stop());
            } catch { /* ignore */ }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoref.current.srcObject = window.localStream;

            for (let id in connections) {
                connections[id].addStream(window.localStream);
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                        })
                        .catch(() => { });
                });
            }
        });
    };

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video, audio })
                .then(getUserMediaSuccess)
                .catch(() => { });
        } else {
            try {
                localVideoref.current.srcObject.getTracks().forEach(track => track.stop());
            } catch { /* ignore */ }
        }
    };

    let getDislayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch { /* ignore */ }

        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                    })
                    .catch(() => { });
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false);
            try {
                localVideoref.current.srcObject.getTracks().forEach(t => t.stop());
            } catch { /* ignore */ }
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoref.current.srcObject = window.localStream;
            getUserMedia();
        });
    };

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);
        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }));
                            }).catch(() => { });
                        }).catch(() => { });
                    }
                }).catch(() => { });
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(() => { });
            }
        }
    };

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });
        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {
            // Fix: Use only the meeting ID/code from the path instead of full URL
            const meetingId = window.location.pathname.split("/").pop();
            socketRef.current.emit('join-call', meetingId, username);
            socketIdRef.current = socketRef.current.id;
            socketRef.current.on('chat-message', addMessage);

            socketRef.current.on('user-left', (id, leavingUser, userData) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id));
                if (id !== socketIdRef.current) {
                    setSnackbarMessage(`${leavingUser || "A user"} has left the meeting.`);
                    setOpenSnackbar(true);
                }
                if (userData) setParticipants(userData);
            });

            socketRef.current.on('user-joined', (id, clients, joiningUser, userData) => {
                if (userData) setParticipants(userData);
                if (id !== socketIdRef.current) {
                    setSnackbarMessage(`${joiningUser || "A user"} joined the meeting!`);
                    setOpenSnackbar(true);
                }

                clients.forEach((socketListId) => {
                    if (connections[socketListId]) return; // Don't re-init existing peers

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                        }
                    };

                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(v => v.socketId === socketListId);
                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(v =>
                                    v.socketId === socketListId ? { ...v, stream: event.stream } : v
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = { socketId: socketListId, stream: event.stream, autoplay: true, playsinline: true };
                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream);
                    }
                });

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue;
                        try { connections[id2].addStream(window.localStream); } catch { /* ignore */ }
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }));
                                })
                                .catch(() => { });
                        });
                    }
                }
            });
        });
    };

    // ── Audio/Video helpers ───────────────────────────────────
    let silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    };

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    };

    let handleVideo = () => setVideo(!video);
    let handleAudio = () => setAudio(!audio);

    useEffect(() => {
        if (screen !== undefined) getDislayMedia();
    }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

    let handleScreen = () => setScreen(!screen);

    let handleEndCall = () => {
        try {
            localVideoref.current.srcObject.getTracks().forEach(track => track.stop());
        } catch { /* ignore */ }
        window.location.href = "/";
    };

    const addMessage = useCallback((data, sender, socketIdSender) => {
        setMessages((prevMessages) => [...prevMessages, { sender, data }]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prev) => prev + 1);
        }
    }, []);

    let sendMessage = () => {
        if (!message.trim()) return;
        socketRef.current.emit('chat-message', message, username);
        setMessage("");
    };

    let handleMessageKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    };

    let copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setSnackbarMessage("Meeting link copied to clipboard!");
        setOpenSnackbar(true);
    };

    const chatFieldSx = {
        '& .MuiInput-underline:before': { borderBottomColor: '#E0E0E0' },
        '& .MuiInput-underline:after': { borderBottomColor: '#000' },
        '& .MuiInputBase-input': { color: '#000', fontSize: '0.9rem' },
        '& .MuiInputLabel-root': { color: '#888', fontSize: '0.9rem' },
    };

    return (
        <div>
            {askForUsername === true ? (
                <div className={styles.lobbyContainer}>
                    <div className={styles.lobbyContent}>
                        <h2>Ready to join?</h2>
                        <div className={styles.videoPreviewContainer}>
                            <video ref={localVideoref} autoPlay muted className={styles.videoPreview} />
                            <div className={styles.previewControls}>
                                <IconButton
                                    onClick={handleVideo}
                                    aria-label={video ? "Turn off camera" : "Turn on camera"}
                                    style={{ color: "#000", backgroundColor: video ? "#F5F5F5" : "#E0E0E0", border: '1px solid #E0E0E0' }}
                                >
                                    {video ? <VideocamIcon /> : <VideocamOffIcon />}
                                </IconButton>
                                <IconButton
                                    onClick={handleAudio}
                                    aria-label={audio ? "Mute" : "Unmute"}
                                    style={{ color: "#000", backgroundColor: audio ? "#F5F5F5" : "#E0E0E0", border: '1px solid #E0E0E0' }}
                                >
                                    {audio ? <MicIcon /> : <MicOffIcon />}
                                </IconButton>
                            </div>
                        </div>

                        <div className={styles.joinForm}>
                            <TextField
                                id="username-input"
                                label="Enter your name"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && username.trim()) connect(); }}
                                fullWidth
                                variant="standard"
                                inputProps={{ 'aria-label': 'Your display name' }}
                                sx={{
                                    mb: 1,
                                    '& .MuiInput-underline:before': { borderBottomColor: '#E0E0E0' },
                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#000000' },
                                    '& .MuiInput-underline:after': { borderBottomColor: '#000000' },
                                    '& .MuiInputLabel-root': { color: '#555555' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#000000' },
                                    '& .MuiInputBase-input': { color: '#000000' },
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={connect}
                                disabled={!username.trim()}
                                fullWidth
                                sx={{
                                    mt: 3, py: 1.5, borderRadius: '4px', fontWeight: 600,
                                    fontSize: '1rem', textTransform: 'none',
                                    background: '#000000', color: '#FFFFFF',
                                    boxShadow: 'none', border: '1px solid #000000',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { background: '#FFFFFF', color: '#000000', boxShadow: 'none' },
                                    '&.Mui-disabled': { background: '#F5F5F5', color: '#A1A1AA', border: '1px solid #E5E5E5', boxShadow: 'none' },
                                }}
                            >
                                Join Meeting
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.meetVideoContainer}>
                    {/* Chat Panel */}
                    {showModal && (
                        <div className={styles.chatRoom}>
                            <div className={styles.chatContainer}>
                                <h1>Chat</h1>
                                <div className={styles.chattingDisplay}>
                                    {messages.length !== 0 ? messages.map((item, index) => (
                                        <div style={{ marginBottom: "16px", borderBottom: '1px solid #F0F0F0', paddingBottom: '12px' }} key={index}>
                                            <p style={{ fontWeight: "700", fontSize: '0.85rem', letterSpacing: '0.02em', marginBottom: '4px' }}>{item.sender}</p>
                                            <p style={{ color: '#333', fontSize: '0.95rem' }}>{item.data}</p>
                                        </div>
                                    )) : <p>No messages yet</p>}
                                </div>
                                <div className={styles.chattingArea}>
                                    <TextField
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={handleMessageKeyDown}
                                        id="chat-message-input"
                                        label="Message"
                                        variant="standard"
                                        fullWidth
                                        inputProps={{ 'aria-label': 'Chat message' }}
                                        sx={chatFieldSx}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={sendMessage}
                                        disabled={!message.trim()}
                                        sx={{
                                            background: '#000', color: '#fff', borderRadius: '4px',
                                            textTransform: 'none', fontWeight: 600, boxShadow: 'none',
                                            border: '1px solid #000',
                                            '&:hover': { background: '#fff', color: '#000', boxShadow: 'none' },
                                            '&.Mui-disabled': { background: '#F5F5F5', color: '#A1A1AA', border: '1px solid #E5E5E5' },
                                        }}
                                        disableElevation
                                    >
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Participants Panel */}
                    {showParticipants && (
                        <div className={styles.chatRoom}>
                            <div className={styles.chatContainer}>
                                <h1>Participants</h1>
                                <div className={styles.chattingDisplay}>
                                    <div style={{ marginBottom: "12px", paddingBottom: '12px', borderBottom: '1px solid #F0F0F0' }}>
                                        <p style={{ fontWeight: "700", fontSize: '0.9rem' }}>
                                            {username} <span style={{ color: '#888', fontWeight: 400 }}>(You)</span>
                                        </p>
                                    </div>
                                    {participants
                                        .filter(p => p.socketId !== socketIdRef.current)
                                        .map((p, index) => (
                                            <div style={{ marginBottom: "12px", paddingBottom: '12px', borderBottom: '1px solid #F0F0F0' }} key={index}>
                                                <p style={{ fontWeight: "600", fontSize: '0.9rem' }}>{p.name}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Control Bar */}
                    <div className={styles.buttonContainers}>
                        <IconButton onClick={handleVideo} title={video ? "Turn off camera" : "Turn on camera"} aria-label={video ? "Turn off camera" : "Turn on camera"} sx={{ color: '#000', '&:hover': { background: '#F5F5F5' } }}>
                            {video ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} title="End call" aria-label="End call" sx={{ color: '#fff', backgroundColor: '#000', border: '1px solid #000', '&:hover': { backgroundColor: '#333' } }}>
                            <CallEndIcon />
                        </IconButton>
                        <IconButton onClick={handleAudio} title={audio ? "Mute" : "Unmute"} aria-label={audio ? "Mute" : "Unmute"} sx={{ color: '#000', '&:hover': { background: '#F5F5F5' } }}>
                            {audio ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable && (
                            <IconButton onClick={handleScreen} title="Share screen" aria-label="Share screen" sx={{ color: '#000', '&:hover': { background: '#F5F5F5' } }}>
                                {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton>
                        )}

                        <IconButton
                            onClick={() => { setShowParticipants(!showParticipants); setModal(false); }}
                            title="Participants" aria-label="Show participants"
                            sx={{ color: '#000', '&:hover': { background: '#F5F5F5' } }}
                        >
                            <PeopleIcon />
                        </IconButton>

                        <IconButton onClick={copyLink} title="Copy meeting link" aria-label="Copy meeting link" sx={{ color: '#000', '&:hover': { background: '#F5F5F5' } }}>
                            <ContentCopyIcon />
                        </IconButton>

                        <Badge badgeContent={newMessages} max={999} sx={{ '& .MuiBadge-badge': { backgroundColor: '#000', color: '#fff' } }}>
                            <IconButton
                                onClick={() => { setModal(!showModal); setShowParticipants(false); setNewMessages(0); }}
                                title="Chat" aria-label="Open chat"
                                sx={{ color: '#000', '&:hover': { background: '#F5F5F5' } }}
                            >
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                    </div>

                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted aria-label="Your video preview" />

                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => { if (ref && video.stream) ref.srcObject = video.stream; }}
                                    autoPlay
                                    playsInline
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </div>
    );
}