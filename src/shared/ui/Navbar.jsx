import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Box,
  Divider,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    onLogout?.();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} className="navbar">
      <Toolbar className="navbar__toolbar">
        <Typography component={Link} to="/" variant="h6" fontWeight={700} className="navbar__brand">
          WaveBridge
        </Typography>
        <Box className="navbar__actions">
          {user ? (
            <>
              <IconButton onClick={handleOpen} size="small">
                <Avatar src={user.avatarUrl} className="navbar__avatar">
                  {user.userName?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                  paper: {
                    className: 'navbar__menu-paper',
                  },
                }}
              >
                <MenuItem disabled className="navbar__menu-user">
                  <Box>
                    <Typography variant="subtitle2" className="navbar__menu-name">
                      {user.userName}
                    </Typography>
                    <Typography variant="caption" className="navbar__menu-email">
                      {user.email}
                    </Typography>
                  </Box>
                </MenuItem>

                <Divider className="navbar__divider" />

                <MenuItem
                  component={Link}
                  to="/dashboard"
                  onClick={handleClose}
                  className="navbar__menu-link"
                >
                  Dashboard
                </MenuItem>

                <Divider className="navbar__divider" />

                <MenuItem onClick={handleLogout} className="navbar__menu-signout">
                  Sign out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link} to="/login"
              variant="contained"
              size="small"
              className="navbar__signin"
            >
              Sign in
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
