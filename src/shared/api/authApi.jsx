import { api, ApiError, BASE_URL, setAccessToken } from './apiClient';

function parseAuthResponse(data) {
  const token = typeof data?.token === 'string' && data.token.trim() ? data.token : null;

  if (!token) {
    throw new ApiError(500, 'Authentication response did not include an access token');
  }

  return {
    token,
    user: data?.user ?? null,
  };
}

export const authApi = {
  register: (payload) => api.post('/Auth/register', payload),
  async login(payload) {
    const data = await api.post('/Auth/login', payload);
    const authData = parseAuthResponse(data);

    setAccessToken(authData.token);

    return {
      ...data,
      accessToken: authData.token,
      user: authData.user,
    };
  },
  async refreshToken() {
    const data = await api.post('/Auth/refresh-token');
    const authData = parseAuthResponse(data);

    setAccessToken(authData.token);

    return {
      ...data,
      accessToken: authData.token,
      user: authData.user,
    };
  },
  getGoogleRedirectUrl: () => `${BASE_URL}/auth/google/redirect`,
};
