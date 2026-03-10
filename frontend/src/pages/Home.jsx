import React, { useContext, useState } from 'react'
import withAuth from '../utils/WithAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    const navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState('');
    const { addToUserHistory } = useContext(AuthContext);

    const handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) return;
        try {
            await addToUserHistory(meetingCode);
        } catch {
            // history tracking is non-critical; proceed to meeting regardless
        }
        navigate(`/${meetingCode}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleJoinVideoCall();
    };

    return (
        <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#000000' }}>
            <div className="navBar" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#FFFFFF', borderBottom: '1px solid #E5E5E5' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2>Connect<span style={{ color: '#555555' }}>Us</span></h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Button
                        startIcon={<RestoreIcon />}
                        onClick={() => navigate('/history')}
                        sx={{ color: '#555555', textTransform: 'none', fontWeight: 600, '&:hover': { color: '#000000', bgcolor: '#F5F5F5' } }}
                    >
                        History
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => { localStorage.removeItem('token'); navigate('/auth'); }}
                        sx={{ color: '#000000', borderColor: '#000000', textTransform: 'none', borderRadius: '4px', px: 3, '&:hover': { borderColor: '#000', bgcolor: '#F9F9F9' } }}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            <div className="meetContainer" style={{ background: '#FFFFFF', color: '#000000' }}>
                <div className="leftPanel">
                    <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.05, marginBottom: '1rem', letterSpacing: '-0.04em' }}>
                        Quality Video Calls <br />
                        <span style={{ color: '#555555', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400 }}>
                            Made Simple.
                        </span>
                    </h2>

                    <p style={{ color: '#555555', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '500px', lineHeight: 1.6 }}>
                        Connect seamlessly with colleagues and loved ones through high-definition, reliable video conferencing.
                    </p>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#FFFFFF', padding: '8px', borderRadius: '4px', width: 'fit-content', border: '1px solid #E5E5E5' }}>
                        <TextField
                            onChange={(e) => setMeetingCode(e.target.value)}
                            onKeyDown={handleKeyDown}
                            id="meeting-code"
                            placeholder="Enter Meeting Code"
                            variant="outlined"
                            size="small"
                            value={meetingCode}
                            inputProps={{ 'aria-label': 'Meeting code' }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#000000',
                                    '& fieldset': { border: 'none' },
                                    width: '250px',
                                },
                                '& .MuiInputBase-input::placeholder': { color: '#A1A1AA', opacity: 1 },
                            }}
                        />
                        <Button
                            onClick={handleJoinVideoCall}
                            variant="contained"
                            disabled={!meetingCode.trim()}
                            sx={{
                                borderRadius: '4px', textTransform: 'none', fontWeight: 600, px: 4, py: 1,
                                background: '#000000', color: '#FFFFFF', boxShadow: 'none',
                                border: '1px solid #000000',
                                '&:hover': { background: '#FFFFFF', color: '#000000', boxShadow: 'none' },
                                '&.Mui-disabled': { background: '#F5F5F5', color: '#A1A1AA', border: '1px solid #E5E5E5' },
                            }}
                            disableElevation
                        >
                            Join
                        </Button>
                    </div>
                </div>

                <div className="rightPanel">
                    <img
                        src="/hero.png"
                        alt="ConnectUs video conferencing preview"
                        style={{ borderRadius: '8px', border: '1px solid #EAEAEA', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', filter: 'grayscale(100%) contrast(1.1)', width: '100%', maxWidth: '500px', height: 'auto' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default withAuth(HomeComponent);