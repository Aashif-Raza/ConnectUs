import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

const defaultTheme = createTheme({
    palette: {
        primary: { main: '#000000' },
        background: { default: '#FFFFFF', paper: '#FFFFFF' },
        text: { primary: '#000000', secondary: '#555555' },
    },
    typography: { fontFamily: "'Inter', sans-serif" },
});

export default function Authentication() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const validate = () => {
        if (!username.trim()) { setError('Username is required.'); return false; }
        if (!password.trim()) { setError('Password is required.'); return false; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return false; }
        if (formState === 1 && !name.trim()) { setError('Full name is required.'); return false; }
        return true;
    };

    const handleAuth = async () => {
        setError('');
        if (!validate()) return;

        setIsLoading(true);
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            }
            if (formState === 1) {
                const result = await handleRegister(name, username, password);
                setUsername('');
                setPassword('');
                setName('');
                setMessage(result || 'Account created! Please sign in.');
                setOpen(true);
                setFormState(0);
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'An error occurred.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAuth();
    };

    const fieldSx = {
        mb: 2,
        '& .MuiInput-underline:before': { borderBottomColor: '#E0E0E0' },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#000000' },
        '& .MuiInput-underline:after': { borderBottomColor: '#000000' },
        '& .MuiInputLabel-root': { color: '#555555' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#000000' },
        '& .MuiInputBase-input': { color: '#000000' },
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', py: 4 }}>
                <CssBaseline />
                <Paper
                    elevation={0}
                    sx={{ width: '100%', maxWidth: 420, backgroundColor: '#FFFFFF', borderRadius: '0px', border: '1px solid #E5E5E5', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', overflow: 'hidden', p: 5 }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, bgcolor: '#000000', width: 48, height: 48, mb: 3 }}>
                            <LockOutlinedIcon fontSize="small" sx={{ color: '#FFFFFF' }} />
                        </Avatar>

                        <Typography component="h1" variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.03em', mb: 4 }}>
                            {formState === 0 ? 'Welcome back' : 'Create an account'}
                        </Typography>

                        {/* Tab toggle */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 4, width: '100%', p: 0.5, bgcolor: '#F5F5F5', borderRadius: '6px' }}>
                            {['Sign In', 'Sign Up'].map((label, idx) => (
                                <Button
                                    key={label}
                                    fullWidth
                                    disableElevation
                                    onClick={() => { setFormState(idx); setError(''); }}
                                    sx={{
                                        borderRadius: '4px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: formState === idx ? '#000' : '#777',
                                        bgcolor: formState === idx ? '#FFFFFF' : 'transparent',
                                        boxShadow: formState === idx ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                        '&:hover': { bgcolor: formState === idx ? '#FFFFFF' : '#EAEAEA' },
                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>

                        <Box component="form" noValidate sx={{ width: '100%' }} onKeyDown={handleKeyDown}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal" required fullWidth
                                    id="name" label="Full Name" name="name"
                                    value={name} autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                    variant="standard" sx={fieldSx}
                                />
                            )}

                            <TextField
                                margin="normal" required fullWidth
                                id="username" label="Username" name="username"
                                value={username} autoFocus={formState === 0}
                                onChange={(e) => setUsername(e.target.value)}
                                variant="standard" sx={fieldSx}
                            />

                            <TextField
                                margin="normal" required fullWidth
                                name="password" label="Password"
                                value={password} type="password" id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                variant="standard" sx={{ ...fieldSx, mb: 3 }}
                            />

                            {error && (
                                <Typography
                                    role="alert"
                                    color="error"
                                    variant="body2"
                                    sx={{ mt: 1, mb: 1, textAlign: 'center', fontSize: '0.875rem' }}
                                >
                                    {error}
                                </Typography>
                            )}

                            <Button
                                type="button" fullWidth variant="contained"
                                disabled={isLoading}
                                sx={{
                                    mt: 3, mb: 2, py: 1.5,
                                    borderRadius: '4px', fontWeight: 600,
                                    fontSize: '1rem', letterSpacing: '0.02em',
                                    textTransform: 'none',
                                    background: '#000000', boxShadow: 'none',
                                    border: '1px solid #000000', color: '#FFFFFF',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { background: '#FFFFFF', color: '#000000', boxShadow: 'none' },
                                    '&.Mui-disabled': { background: '#F5F5F5', color: '#A1A1AA', border: '1px solid #E5E5E5' },
                                }}
                                onClick={handleAuth}
                                disableElevation
                            >
                                {isLoading ? 'Please wait…' : (formState === 0 ? 'Sign In' : 'Create Account')}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                message={message}
                action={
                    <Button size="small" onClick={() => setOpen(false)} sx={{ color: '#000', fontWeight: 700 }}>
                        CLOSE
                    </Button>
                }
            />
        </ThemeProvider>
    );
}