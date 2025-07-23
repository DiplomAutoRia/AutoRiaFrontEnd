export const routes = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  NOT_FOUND: '*',
  API: {
    BASE: import.meta.env.VITE_BASE_API_URL,
    USERS: '/users',
    VEHICLES: '/vehicles',
    FAVORITES: '/favorites',
    USER_MESSAGES: '/user_messages',
    COMMENTS: '/comments',
    REPORTS: '/reports',
  },
};
