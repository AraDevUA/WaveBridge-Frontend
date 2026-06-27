import { Box, CircularProgress } from '@mui/material';
import Navbar from '../shared/ui/Navbar';
import { useAuth } from '../shared/hooks/useAuth';
import AppRoutes from './routes';
import './App.css';

export default function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <Box className="app__loading">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box className="app">
      <Navbar user={user} onLogout={logout} />
      <AppRoutes user={user} />
    </Box>
  );
}
