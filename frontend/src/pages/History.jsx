import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton, Snackbar, Button } from '@mui/material';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [fetchError, setFetchError] = useState('');
    const [snackOpen, setSnackOpen] = useState(false);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(Array.isArray(history) ? history : []);
            } catch {
                setFetchError('Failed to load meeting history. Please try again.');
                setSnackOpen(true);
            }
        };
        fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#FFFFFF', color: '#000000', p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 2, borderBottom: '1px solid #E5E5E5', pb: 3 }}>
                <IconButton
                    onClick={() => routeTo('/home')}
                    aria-label="Go back to home"
                    sx={{ color: '#000000', bgcolor: '#F5F5F5', borderRadius: '4px', '&:hover': { bgcolor: '#E5E5E5' } }}
                >
                    <HomeIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.03em', color: '#000000' }}>
                    Meeting History
                </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                {meetings.length !== 0 ? meetings.map((e, i) => (
                    <Card
                        key={e._id || i}
                        elevation={0}
                        sx={{
                            bgcolor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '4px',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.05)', transition: 'all 0.2s ease',
                            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', border: '1px solid #CCCCCC' },
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography sx={{ fontSize: '0.75rem', color: '#888888', mb: 1.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Meeting Code
                            </Typography>
                            <Typography variant="h5" component="p" sx={{ color: '#000000', fontWeight: 800, mb: 3, letterSpacing: '-0.02em', fontFamily: 'monospace' }}>
                                {e.meetingCode}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 2, borderTop: '1px solid #F0F0F0' }}>
                                <Typography sx={{ color: '#888888', fontSize: '0.9rem' }}>
                                    Joined on: <span style={{ color: '#000000', fontWeight: 600 }}>{formatDate(e.date)}</span>
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                )) : !fetchError ? (
                    <Typography sx={{ color: '#888888', fontSize: '1.1rem', gridColumn: '1 / -1', textAlign: 'center', mt: 10 }}>
                        No meeting history found. Join a meeting to see it here.
                    </Typography>
                ) : null}
            </Box>

            <Snackbar
                open={snackOpen}
                autoHideDuration={5000}
                onClose={() => setSnackOpen(false)}
                message={fetchError}
                action={
                    <Button size="small" onClick={() => setSnackOpen(false)} sx={{ color: '#fff', fontWeight: 700 }}>
                        CLOSE
                    </Button>
                }
            />
        </Box>
    );
}