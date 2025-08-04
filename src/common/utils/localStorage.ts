const USER_STORAGE_KEY = 'autoRia_user';
const TOKEN_STORAGE_KEY = 'autoRia_token';
const REFRESH_TOKEN_STORAGE_KEY = 'autoRia_refreshToken';

export const saveUserToStorage = (user: any) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
  }
};

export const getUserFromStorage = () => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
};

export const removeUserFromStorage = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
  }
};

export const saveTokenToStorage = (token: string) => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
  }
};

export const getTokenFromStorage = () => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    return null;
  }
};

export const removeTokenFromStorage = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
  }
};

export const saveRefreshTokenToStorage = (token: string) => {
  try {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
  } catch (error) {
  }
};

export const getRefreshTokenFromStorage = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch (error) {
    return null;
  }
};

export const removeRefreshTokenFromStorage = () => {
  try {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch (error) {
  }
};

export const clearAllStorage = () => {
  removeUserFromStorage();
  removeTokenFromStorage();
  removeRefreshTokenFromStorage();
};