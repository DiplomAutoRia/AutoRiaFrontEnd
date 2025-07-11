import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface RegisterState {
  loading: boolean;
  error: string | null;
  step: 'main' | 'confirm' | 'done';
}

const initialState: RegisterState = {
  loading: false,
  error: null,
  step: 'main',
};

export const initialRegister = createAsyncThunk(
  'auth/initialRegister',
  async (data: { first_name: string; last_name: string; contact_info: string }, { rejectWithValue }) => {
    try {
      await axios.post('http://localhost:8000/api/users/register/initial/', data);
      return true;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.contact_info || 'Registration error');
    }
  }
);

export const verifyRegister = createAsyncThunk(
  'auth/verifyRegister',
  async (data: { contact_info: string; code: string }, { rejectWithValue }) => {
    try {
      await axios.post('http://localhost:8000/api/users/register/verify/', data);
      return true;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.code || 'Verification error');
    }
  }
);

export const completeRegister = createAsyncThunk(
  'auth/completeRegister',
  async (data: { contact_info: string; password: string; password_confirm: string }, { rejectWithValue }) => {
    try {
      await axios.post('http://localhost:8000/api/users/register/complete/', data);
      return true;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.password || 'Password error');
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetRegister(state) {
      state.step = 'main';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(initialRegister.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initialRegister.fulfilled, state => {
        state.loading = false;
        state.step = 'confirm';
      })
      .addCase(initialRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyRegister.fulfilled, state => {
        state.step = 'done';
      })
      .addCase(verifyRegister.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(completeRegister.fulfilled, state => {
        state.step = 'done';
      })
      .addCase(completeRegister.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetRegister } = registerSlice.actions;
export default registerSlice.reducer;