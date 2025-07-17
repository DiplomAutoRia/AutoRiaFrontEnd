import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { routes } from '../../routes';

const baseQuery = fetchBaseQuery({
  baseUrl: routes.API.BASE,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['USERS', 'VEHICLES', 'COMMENTS', 'FAVORITES', 'REPORTS'],
  endpoints: () => ({}),
});
