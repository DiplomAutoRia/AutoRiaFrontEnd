import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface LoginState {
  loading: boolean;
  error: string | null;
  user: any | null;
}

const initialState: LoginState = {
  loading: false,
  error: null,
  user: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/users/login/', data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Login error');
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;