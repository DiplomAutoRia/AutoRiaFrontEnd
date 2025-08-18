import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

import { getErrorMessage } from '../../common/utils/errorUtils';
import {
  clearAllStorage,
  getRefreshTokenFromStorage,
  getTokenFromStorage,
  getUserFromStorage,
  saveRefreshTokenToStorage,
  saveTokenToStorage,
  saveUserToStorage,
} from '../../common/utils/localStorage';
import { routes } from '../../routes';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  location?: string;
  is_verified: boolean;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  user: User | null;
  registerStep: 'initial' | 'verify' | 'complete' | 'done';
  contactInfo: { type: 'email' | 'phone'; value: string } | null;
  successMessage: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  user: getUserFromStorage(),
  registerStep: 'initial',
  contactInfo: null,
  successMessage: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: { contact_info: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${routes.API.BASE}/users/login/`,
        {
          contact_info: data.contact_info,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          validateStatus: (status) => status < 500,
        },
      );

      if (response.status >= 400) {
        if (response.data?.non_field_errors) {
          throw new Error(response.data.non_field_errors.join(', '));
        } else if (response.data?.password) {
          throw new Error(response.data.password);
        }
        throw new Error('Login failed. Please try again.');
      }

      Cookies.set('access_token', response.data.access, { expires: 30 });
      Cookies.set('refresh_token', response.data.refresh, { expires: 30 });
      saveTokenToStorage(response.data.access);
      saveRefreshTokenToStorage(response.data.refresh);

      return {
        user: {
          id: response.data.user_id,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          is_verified: true,
        },
      };
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const initialRegister = createAsyncThunk(
  'auth/initialRegister',
  async (
    data: {
      first_name: string;
      last_name: string;
      contact_info: { type: 'email' | 'phone'; value: string };
    },
    { rejectWithValue },
  ) => {
    try {
      await axios.post(`${routes.API.BASE}/users/register/initial/`, {
        first_name: data.first_name,
        last_name: data.last_name,
        contact_info: data.contact_info.value,
      });

      return {
        contactInfo: data.contact_info,
        message: `Verification code sent to your ${data.contact_info.type}.`,
      };
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const verifyRegister = createAsyncThunk(
  'auth/verifyRegister',
  async (data: { contact_info: string; code: string }, { rejectWithValue }) => {
    try {
      await axios.post(`${routes.API.BASE}/users/register/verify/`, data);
      return { message: 'Verification successful. Now you can set your password.' };
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const completeRegister = createAsyncThunk(
  'auth/completeRegister',
  async (data: { contact_info: string; password: string; password_confirm: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${routes.API.BASE}/users/register/complete/`, data);

      if (response.data.access) {
        Cookies.set('access_token', response.data.access, { expires: 30 });
        Cookies.set('refresh_token', response.data.refresh, { expires: 30 });
        saveTokenToStorage(response.data.access);
        saveRefreshTokenToStorage(response.data.refresh);
      }

      return {
        message: 'User registered successfully.',
        user: response.data.user || {
          id: response.data.user_id,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          phone_number: response.data.phone_number,
          is_verified: true,
        },
      };
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const googleAuth = createAsyncThunk('auth/googleAuth', async (token: string, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${routes.API.BASE}/users/social/google/login/`, {
      token,
    });

    Cookies.set('access_token', response.data.access, { expires: 30 });
    Cookies.set('refresh_token', response.data.refresh, { expires: 30 });
    saveTokenToStorage(response.data.access);
    saveRefreshTokenToStorage(response.data.refresh);

    return {
      user: {
        id: response.data.user_id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        is_verified: true,
      },
    };
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const checkTokenValidity = createAsyncThunk('auth/checkTokenValidity', async () => {
  try {
    let accessToken = Cookies.get('access_token') || getTokenFromStorage();
    let refreshToken = Cookies.get('refresh_token') || getRefreshTokenFromStorage();

    if (!accessToken || !refreshToken) {
      clearAllStorage();
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      return { user: null };
    }

    if (accessToken && !Cookies.get('access_token')) {
      Cookies.set('access_token', accessToken, { expires: 30 });
    }
    if (refreshToken && !Cookies.get('refresh_token')) {
      Cookies.set('refresh_token', refreshToken, { expires: 30 });
    }

    await axios.post(`${routes.API.BASE}/users/token/verify/`, {
      token: accessToken,
    });

    const user = getUserFromStorage();
    return { user };
  } catch {
    try {
      const refreshToken = Cookies.get('refresh_token') || getRefreshTokenFromStorage();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const refreshResponse = await axios.post(`${routes.API.BASE}/users/token/refresh/`, {
        refresh: refreshToken,
      });

      const newAccessToken = refreshResponse.data.access;
      Cookies.set('access_token', newAccessToken, { expires: 30 });
      saveTokenToStorage(newAccessToken);

      const user = getUserFromStorage();
      return { user };
    } catch {
      clearAllStorage();
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      return { user: null };
    }
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      clearAllStorage();
    },
    resetRegister(state) {
      state.registerStep = 'initial';
      state.error = null;
      state.successMessage = null;
      state.contactInfo = null;
    },
    setContactInfo(state, action: PayloadAction<{ type: 'email' | 'phone'; value: string } | null>) {
      state.contactInfo = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        saveUserToStorage(action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(initialRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initialRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.registerStep = 'verify';
        state.contactInfo = action.payload.contactInfo;
        state.successMessage = action.payload.message;
      })
      .addCase(initialRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(verifyRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.registerStep = 'complete';
        state.successMessage = action.payload.message;
      })
      .addCase(verifyRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(completeRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.registerStep = 'done';
        state.successMessage = action.payload.message;
        state.user = action.payload.user;
        saveUserToStorage(action.payload.user);
      })
      .addCase(completeRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        saveUserToStorage(action.payload.user);
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(checkTokenValidity.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkTokenValidity.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        saveUserToStorage(action.payload.user);
      })
      .addCase(checkTokenValidity.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      });
  },
});

export const { logout, resetRegister, setContactInfo, clearError } = authSlice.actions;
export default authSlice.reducer;
