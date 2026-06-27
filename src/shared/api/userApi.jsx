import { api } from './apiClient';

export const userApi = {
  getProfileInfo: () => api.get('/Profile'),
};
