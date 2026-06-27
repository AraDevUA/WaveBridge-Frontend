export const BASE_URL = 'https://localhost:7270';
export const AUTH_CHANGED_EVENT = 'auth-changed';
const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
const LOGOUT_STATE_STORAGE_KEY = 'authLoggedOut';

export class ApiError extends Error {
    constructor(status, message, validationErrors = null) {
        super(message);
        this.status = status;
        this.validationErrors = validationErrors;
    }
}
export function mapValidationErrors(validationErrors) {
  const mapped = {};
  for (const [field, messages] of Object.entries(validationErrors)) {
    const key = field.charAt(0).toLowerCase() + field.slice(1);
    mapped[key] = messages[0];
  }
  return mapped;
}

function parseResponseData(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(data) {
  if (typeof data === 'string' && data.trim()) return data;
  if (data && typeof data === 'object') {
    if (typeof data.message === 'string' && data.message.trim()) return data.message;
    if (typeof data.title === 'string' && data.title.trim()) return data.title;
    if (typeof data.detail === 'string' && data.detail.trim()) return data.detail;
  }

  return 'An error occurred';
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function isLoggedOut() {
  return sessionStorage.getItem(LOGOUT_STATE_STORAGE_KEY) === 'true';
}

export function setLoggedOutState(value) {
  if (value) {
    sessionStorage.setItem(LOGOUT_STATE_STORAGE_KEY, 'true');
    return;
  }

  sessionStorage.removeItem(LOGOUT_STATE_STORAGE_KEY);
}

export function setAccessToken(token) {
  const normalizedToken = typeof token === 'string' && token.trim() ? token : null;
  const currentToken = getAccessToken();

  if (currentToken === normalizedToken) {
    return;
  }

  if (!normalizedToken) {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    return;
  }

  setLoggedOutState(false);
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, normalizedToken);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

async function request(endpoint, options = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers ?? {});

  if (!headers.has('Content-Type') && options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers,
    ...options,
  });
  
  const text = await response.text();
  const data = parseResponseData(text);
  const nextAccessToken = response.headers.get('X-Access-Token');

  if (nextAccessToken) {
    setAccessToken(nextAccessToken);
  }

  if (response.ok) return data;  

  if (response.status === 400 && typeof data === 'object' && data !== null && data.errors) {
    throw new ApiError(response.status, "Validation error", data.errors);
  }

  const message = getErrorMessage(data);
  throw new ApiError(response.status, message);
}

export const api = {
post: (endpoint, body, options = {}) =>
  request(endpoint, {
    method: 'POST',
    ...options,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  }),
get: (endpoint) => request(endpoint, { method: 'GET' }),
};

