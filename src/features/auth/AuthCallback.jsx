import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../shared/api/authApi';
import './AuthCallback.css';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function completeGoogleSignIn() {
      try {
        await authApi.refreshToken();

        if (!cancelled) {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message ?? 'Authentication failed');
        }
      }
    }

    completeGoogleSignIn();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <Box className="auth-callback">
      {error ? (
        <Stack spacing={2} alignItems="center" maxWidth={360}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            We could not complete your sign-in from the refresh token cookie.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/login', { replace: true })}>
            Back to sign in
          </Button>
        </Stack>
      ) : (
        <CircularProgress color="primary" />
      )}
    </Box>
  );
}
