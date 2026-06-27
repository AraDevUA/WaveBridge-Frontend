import { api } from './apiClient';

export const transferApi = {
  getTransfer: (transferId) =>
    api.get(`/Transfers/${transferId}`),

  getSourcePlaylists: (source, page = 0, pageSize = 20) =>
    api.get(`/Transfers/sources/${source}/playlists`, { page, pageSize }),

  getPlaylistTracks: (source, playlistId) =>
    api.get(`/Transfers/sources/${source}/playlists/${playlistId}/tracks`),

  getLikedTracks: (source, page = 0, pageSize = 20) =>
    api.get(`/Transfers/sources/${source}/liked-tracks`, { page, pageSize }),
  
  getHistory: (page = 1, pageSize = 20) =>
    api.get(`/Transfers/history?page=${page}&pageSize=${pageSize}`),

  startTransfer: (dto) =>
    api.post('/Transfers', dto),
};

export const StreamingService = {
  Spotify: 0,
  YouTubeMusic: 1,
  SoundCloud: 2,
};

export const StreamingServiceLabel = {
  [StreamingService.Spotify]: 'Spotify',
  [StreamingService.YouTubeMusic]: 'YouTube Music',
  [StreamingService.SoundCloud]: 'SoundCloud',
};

export const TransferStatus = {
  Queued: 0,
  InProgress: 1,
  Completed: 2,
  Failed: 3,
};