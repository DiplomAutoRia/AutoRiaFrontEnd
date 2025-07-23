interface User {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  is_verified: boolean;
}

const USER_STORAGE_KEY = 'autoRia_user';

export const saveUserToStorage = (user: User): void => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
  }
};

export const getUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Failed to get user from localStorage:', error);
    return null;
  }
};

export const removeUserFromStorage = (): void => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to remove user from localStorage:', error);
  }
};

export const clearAllStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};
