import { useState, useEffect } from 'react';
import {
  AUTH_CHANGED_EVENT,
  getAccessToken,
  isLoggedOut,
  setAccessToken,
  setLoggedOutState,
} from '../api/apiClient';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      if (!active) return;

      setLoading(true);

      try {
        if (!getAccessToken()) {
          if (isLoggedOut()) {
            setUser(null);
            return;
          }

          await authApi.refreshToken();
        }

        const me = await userApi.getProfileInfo();
        if (active) setUser(me);
      } catch {
        if (active) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUser();
    window.addEventListener(AUTH_CHANGED_EVENT, loadUser);

    return () => {
      active = false;
      window.removeEventListener(AUTH_CHANGED_EVENT, loadUser);
    };
  }, []);

  const logout = () => {
    setLoggedOutState(true);
    setAccessToken(null);
    setUser(null);
  };

  return { user, loading, logout };
}
