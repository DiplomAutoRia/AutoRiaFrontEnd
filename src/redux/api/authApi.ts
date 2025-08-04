import { apiSlice } from './apiSlice';

interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

interface ChangePasswordResponse {
  message: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: '/auth/change-password/',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = authApi;