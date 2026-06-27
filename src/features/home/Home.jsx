import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, AUTH_CHANGED_EVENT } from '../../shared/api/apiClient';
import {
  transferApi,
  StreamingService,
  StreamingServiceLabel,
  TransferStatus,
} from '../../shared/api/transferApi';
import SpotifyIcon from '../../assets/spotify.svg';
import YoutubeIcon from '../../assets/youtubeMusic.svg';
import SoundcloudIcon from '../../assets/soundcloud.svg';
import './Home.css';

const SERVICE_META = {
  [StreamingService.Spotify]: {
    color: '#1DB954',
    icon: SpotifyIcon,
  },
  [StreamingService.YouTubeMusic]: {
    color: '#FF0000',
    icon: YoutubeIcon,
  },
  [StreamingService.SoundCloud]: {
    color: '#FF5500',
    icon: SoundcloudIcon,
  },
};

const SERVICES = Object.values(StreamingService).map((id) => ({
  id,
  name: StreamingServiceLabel[id],
  ...SERVICE_META[id],
}));

const STATUS_META = {
  [TransferStatus.Queued]: {
    label: 'Queued',
    color: 'default',
  },
  [TransferStatus.InProgress]: {
    label: 'In Progress',
    color: 'warning',
  },
  [TransferStatus.Completed]: {
    label: 'Completed',
    color: 'success',
  },
  [TransferStatus.Failed]: {
    label: 'Failed',
    color: 'error',
  },
};

const GUEST_STEPS = ['Choose source', 'Choose destination', 'Done'];
const ARROW_SYMBOL = '→';
const SUMMARY_SEPARATOR = ' • ';

function formatDate(iso) {
  if (!iso) {
    return null;
  }

  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function pluralPlaylists(count) {
  return `${count} ${count === 1 ? 'playlist' : 'playlists'}`;
}

function getStatusMeta(status) {
  return (
    STATUS_META[status] ?? {
      label: `Status ${status}`,
      color: 'default',
    }
  );
}

function buildTransferSummary(transfer) {
  const parts = [pluralPlaylists(transfer.playlistCount)];

  if (transfer.startedUtc) {
    parts.push(formatDate(transfer.startedUtc));
  }

  return parts.join(SUMMARY_SEPARATOR);
}

function ServiceIcon({ serviceId, height = 26 }) {
  const meta = SERVICE_META[serviceId];

  if (!meta) {
    return null;
  }

  return (
    <Box
      className="home__service-icon"
      style={{
        '--service-accent': meta.color,
        '--service-icon-height': `${height}px`,
      }}
    >
      <Box
        component="img"
        src={meta.icon}
        alt={StreamingServiceLabel[serviceId]}
        className="home__service-icon-image"
      />
    </Box>
  );
}

function StatusChip({ status }) {
  const { color, label } = getStatusMeta(status);

  return (
    <Chip
      label={label}
      color={color}
      size="small"
      variant="outlined"
      className="home__status-chip"
    />
  );
}

function GuestStep({ index, label, isLast }) {
  return (
    <Box className="home__step">
      <Box className="home__step-content">
        <Box className="home__step-badge">{index + 1}</Box>
        <Typography variant="body2" className="home__step-label">
          {label}
        </Typography>
      </Box>
      {!isLast && <Typography className="home__arrow">{ARROW_SYMBOL}</Typography>}
    </Box>
  );
}

function ServiceOption({ service, isSelected, onSelect }) {
  return (
    <Grid item xs={6} sm={4}>
      <Paper
        elevation={0}
        onClick={() => onSelect(service.id)}
        className={`home__service-card${isSelected ? ' home__service-card--selected' : ''}`}
      >
        <Box component="img" src={service.icon} alt={service.name} className="home__service-logo" />
      </Paper>
    </Grid>
  );
}

function TransferCard({ transfer, onOpen }) {
  const sourceLabel = StreamingServiceLabel[transfer.sourceService];
  const targetLabel =
    transfer.targetService != null ? StreamingServiceLabel[transfer.targetService] : '-';

  return (
    <Paper elevation={0} onClick={() => onOpen(transfer.id)} className="home__transfer-card">
      <Box className="home__transfer-services">
        <ServiceIcon serviceId={transfer.sourceService} height={34} />
        <Typography className="home__arrow">{ARROW_SYMBOL}</Typography>
        <ServiceIcon serviceId={transfer.targetService} height={34} />
      </Box>

      <Box className="home__transfer-content">
        <Typography variant="body2" fontWeight={600} noWrap className="home__transfer-title">
          {sourceLabel}
          {' -> '}
          {targetLabel}
        </Typography>
        <Typography variant="caption" className="home__transfer-meta">
          {buildTransferSummary(transfer)}
        </Typography>
      </Box>

      <StatusChip status={transfer.status} />
    </Paper>
  );
}

function GuestHome() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

  const continueLabel =
    selectedService !== null
      ? `Continue with ${StreamingServiceLabel[selectedService]}`
      : 'Select a service';

  return (
    <Box>
      <Box className="home__guest-header">
        <Typography variant="h4" fontWeight={700} className="home__title">
          Transfer your music in a few clicks
        </Typography>
        <Typography variant="body1" className="home__description">
          Choose where to transfer from, then where to transfer to. We&apos;ll move all your
          playlists and liked tracks.
        </Typography>
      </Box>

      <Box className="home__steps">
        {GUEST_STEPS.map((step, index) => (
          <GuestStep key={step} index={index} label={step} isLast={index === GUEST_STEPS.length - 1} />
        ))}
      </Box>

      <Typography variant="overline" className="home__section-label">
        Transfer from
      </Typography>

      <Grid container spacing={1.5} className="home__services">
        {SERVICES.map((service) => (
          <ServiceOption
            key={service.id}
            service={service}
            isSelected={selectedService === service.id}
            onSelect={setSelectedService}
          />
        ))}
      </Grid>

      <Box className="home__actions">
        <Button
          variant="contained"
          size="large"
          disabled={selectedService === null}
          onClick={() => navigate(`/transfer/new?from=${selectedService}`)}
          className="home__primary-button home__guest-button"
        >
          {continueLabel}
        </Button>
      </Box>
    </Box>
  );
}

function AuthenticatedHome() {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTransfers() {
      setLoading(true);
      setError(null);

      try {
        const data = await transferApi.getHistory(1, 20);

        if (!cancelled) {
          setTransfers(data.items ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load transfers');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTransfers();

    return () => {
      cancelled = true;
    };
  }, []);

  const completedCount = transfers.filter(
    (transfer) => transfer.status === TransferStatus.Completed
  ).length;
  const pendingCount = transfers.filter(
    (transfer) =>
      transfer.status === TransferStatus.InProgress || transfer.status === TransferStatus.Queued
  ).length;

  return (
    <Box>
      <Box className="home__auth-header">
        <Box>
          <Typography variant="h5" fontWeight={700} className="home__section-title">
            My transfers
          </Typography>
          {!loading && !error && (
            <Typography variant="body2" className="home__summary">
              {completedCount} completed
              {pendingCount > 0 ? `${SUMMARY_SEPARATOR}${pendingCount} in progress` : ''}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate('/transfer/new')}
          className="home__primary-button home__auth-button"
        >
          New transfer
        </Button>
      </Box>

      {loading && (
        <Box className="home__loading">
          <CircularProgress size={28} />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" className="home__error">
          {error}
        </Alert>
      )}

      {!loading && !error && transfers.length === 0 && (
        <Paper elevation={0} className="home__empty">
          <Typography variant="body1" className="home__transfer-meta">
            You have no transfers yet. Start your first one!
          </Typography>
        </Paper>
      )}

      {!loading && !error && transfers.length > 0 && (
        <Box className="home__transfers">
          {transfers.map((transfer) => (
            <TransferCard
              key={transfer.id}
              transfer={transfer}
              onOpen={(transferId) => navigate(`/transfer/${transferId}`)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAccessToken()));

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(Boolean(getAccessToken()));

    window.addEventListener(AUTH_CHANGED_EVENT, syncAuthState);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuthState);
    };
  }, []);

  return (
    <Box className="home">
      <Box className="home__container">{isAuthenticated ? <AuthenticatedHome /> : <GuestHome />}</Box>
    </Box>
  );
}
