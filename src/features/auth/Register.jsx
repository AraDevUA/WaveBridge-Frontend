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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authApi } from '../../shared/api/authApi';
import { useForm } from '../../shared/hooks/useForm';
import GoogleIcon from '@mui/icons-material/Google';
import './AuthForm.css';

export default function Register() {
  const navigate = useNavigate();

  const handleGoogleRegister = () => {
    window.location.href = authApi.getGoogleRedirectUrl();
  };

  const { form, errors, serverError, loading, handleChange, handleSubmit } = useForm(
    { userName: '', email: '', password: '', confirm: '' },
    (values) => {
      const nextErrors = {};

      if (!values.userName.trim()) {
        nextErrors.userName = 'Username is required';
      }

      if (!values.email.trim()) {
        nextErrors.email = 'Email is required';
      } else if (!values.email.includes('@')) {
        nextErrors.email = 'Invalid email';
      }

      if (!values.password) {
        nextErrors.password = 'Password is required';
      }

      if (values.password !== values.confirm) {
        nextErrors.confirm = 'Passwords do not match';
      }

      return nextErrors;
    },
    async (values) => {
      await authApi.register({
        userName: values.userName,
        email: values.email,
        password: values.password,
      });
      navigate('/login', {
        replace: true,
        state: {
          registrationSucceeded: true,
          registeredEmail: values.email,
        },
      });
    }
  );

  return (
    <Box className="auth-form-page">
      <Paper elevation={0} className="auth-form-card">
        <Typography variant="h6" fontWeight={600} className="auth-form-title">
          Create an account
        </Typography>

        <Typography variant="body2" className="auth-form-subtitle auth-form-subtitle--spacious">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" underline="hover" className="auth-form-link">
            Sign in
          </Link>
        </Typography>

        {serverError && (
          <Alert severity="error" className="auth-form-error">
            {serverError}
          </Alert>
        )}

        <Button
          type="button"
          variant="outlined"
          fullWidth
          onClick={handleGoogleRegister}
          disabled={loading}
          startIcon={<GoogleIcon />}
          className="auth-form-google-button"
        >
          Sign up with Google
        </Button>

        <Divider className="auth-form-divider">OR</Divider>

        <Box component="form" onSubmit={handleSubmit} className="auth-form-fields">
          <TextField
            label="Username"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="your_username"
            error={Boolean(errors.userName)}
            helperText={errors.userName}
            fullWidth
            className="auth-form-input"
          />

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

          <TextField
            label="Confirm Password"
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            placeholder="Repeat password"
            error={Boolean(errors.confirm)}
            helperText={errors.confirm}
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
            {loading ? <CircularProgress size={20} className="auth-form-submit-spinner" /> : 'Register'}
          </Button>
        </Box>

        <Typography variant="caption" className="auth-form-footer">
          By registering, you agree to our{' '}
          <Link href="#" underline="hover" className="auth-form-footer-link">
            terms of use
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
