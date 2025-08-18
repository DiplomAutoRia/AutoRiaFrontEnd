import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import {
  clearAllStorage,
  getRefreshTokenFromStorage,
  getTokenFromStorage,
  saveTokenToStorage,
} from '../../common/utils/localStorage';
import { routes } from '../../routes';

const baseQuery = fetchBaseQuery({
  baseUrl: routes.API.BASE,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = Cookies.get('access_token') || getTokenFromStorage();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = Cookies.get('refresh_token') || getRefreshTokenFromStorage();
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/users/token/refresh/',
          method: 'POST',
          body: { refresh: refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const { access } = refreshResult.data as { access: string };
        Cookies.set('access_token', access, { expires: 30 });
        saveTokenToStorage(access);
        result = await baseQuery(args, api, extraOptions);
      } else {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        clearAllStorage();
        window.location.href = '/login';
      }
    } else {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      clearAllStorage();
      window.location.href = '/login';
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['USERS', 'VEHICLES', 'COMMENTS', 'FAVORITES', 'REPORTS', 'CONVERSATIONS'],
  endpoints: () => ({}),
});
