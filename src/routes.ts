export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  notFound: '*',
  API:{
    BASE: import.meta.env.VITE_BASE_API_URL,
    USERS: '/users',
    VEHICLES: '/vehicles',
    FAVORITES: '/favorites',
    USER_MESSAGES: '/user_messages',
    COMMENTS: '/comments',
    REPORTS: '/reports',
  }
};  

