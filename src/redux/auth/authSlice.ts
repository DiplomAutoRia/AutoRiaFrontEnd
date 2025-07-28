import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

import { getUserFromStorage, removeUserFromStorage, saveUserToStorage } from '../../common/utils/localStorage';
import { routes } from '../../routes';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
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

      Cookies.set('access_token', response.data.access);
      Cookies.set('refresh_token', response.data.refresh);

      return {
        user: {
          id: response.data.user_id,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          is_verified: true,
        },
      };
    } catch (err: any) {
      if (err.response?.data?.non_field_errors) {
        return rejectWithValue(err.response.data.non_field_errors.join(', '));
      } else if (err.response?.data?.password) {
        return rejectWithValue(err.response.data.password);
      }
      return rejectWithValue(err.message || 'Помилка входу. Перевірте введені дані');
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
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Registration error');
    }
  },
);

export const verifyRegister = createAsyncThunk(
  'auth/verifyRegister',
  async (data: { contact_info: string; code: string }, { rejectWithValue }) => {
    try {
      await axios.post(`${routes.API.BASE}/users/register/verify/`, data);
      return { message: 'Verification successful. Now you can set your password.' };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Verification error');
    }
  },
);

export const completeRegister = createAsyncThunk(
  'auth/completeRegister',
  async (data: { contact_info: string; password: string; password_confirm: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${routes.API.BASE}/users/register/complete/`, data);

      // Set tokens if returned
      if (response.data.access) {
        Cookies.set('access_token', response.data.access);
        Cookies.set('refresh_token', response.data.refresh);
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
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Completion error');
    }
  },
);

export const googleAuth = createAsyncThunk('auth/googleAuth', async (token: string, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${routes.API.BASE}/users/social/google/login/`, {
      token,
    });

    Cookies.set('access_token', response.data.access);
    Cookies.set('refresh_token', response.data.refresh);

    return {
      user: {
        id: response.data.user_id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        is_verified: true,
      },
    };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.detail || 'Google authentication failed');
  }
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: { first_name?: string; last_name?: string; email?: string; phone_number?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${routes.API.BASE}/users/profile/`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return {
        user: response.data,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Profile update failed');
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'auth/deleteProfile',
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${routes.API.BASE}/users/profile/delete/`, {
        withCredentials: true
      });
      return {};
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Profile deletion failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      removeUserFromStorage();
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
      
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        saveUserToStorage(action.payload.user);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        removeUserFromStorage();
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, resetRegister, setContactInfo, clearError } = authSlice.actions;
export default authSlice.reducer;
