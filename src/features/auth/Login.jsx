import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../shared/api/authApi';
import { useForm } from '../../shared/hooks/useForm';
import GoogleIcon from '@mui/icons-material/Google';
import './AuthForm.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationMessage = location.state?.registrationSucceeded
    ? `Account created for ${location.state?.registeredEmail ?? 'your email'}. Sign in to continue.`
    : '';

  const handleGoogleLogin = () => {
    window.location.href = authApi.getGoogleRedirectUrl();
  };

  const { form, errors, serverError, loading, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    (values) => {
      const nextErrors = {};

      if (!values.email.trim()) {
        nextErrors.email = 'Email is required';
      } else if (!values.email.includes('@')) {
        nextErrors.email = 'Invalid email';
      }

      if (!values.password) {
        nextErrors.password = 'Password is required';
      }

      return nextErrors;
    },
    async (values) => {
      await authApi.login(values);
      navigate('/dashboard', { replace: true });
    }
  );

  return (
    <Box className="auth-form-page">
      <Paper elevation={0} className="auth-form-card">
        <Typography variant="h6" fontWeight={600} className="auth-form-title">
          Welcome back
        </Typography>

        <Typography variant="body2" className="auth-form-subtitle">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to="/register" className="auth-form-link">
            Sign up
          </Link>
        </Typography>

        {serverError && (
          <Alert severity="error" className="auth-form-error">
            {serverError}
          </Alert>
        )}

        {registrationMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {registrationMessage}
          </Alert>
        )}

        <Button
          type="button"
          variant="outlined"
          fullWidth
          onClick={handleGoogleLogin}
          disabled={loading}
          startIcon={<GoogleIcon />}
          className="auth-form-google-button"
        >
          Continue with Google
        </Button>

        <Divider className="auth-form-divider">OR</Divider>

        <Box component="form" onSubmit={handleSubmit} className="auth-form-fields">
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={Boolean(errors.email)}
            helperText={errors.email}
            fullWidth
            className="auth-form-input"
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            error={Boolean(errors.password)}
            helperText={errors.password}
            fullWidth
            className="auth-form-input"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            className="auth-form-submit"
          >
            {loading ? (
              <CircularProgress
                size={20}
                className="auth-form-submit-spinner auth-form-submit-spinner--login"
              />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>

        <Typography variant="caption" className="auth-form-footer">
          By signing in, you agree to our{' '}
          <Link href="#" underline="hover" className="auth-form-footer-link">
            terms of use
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
