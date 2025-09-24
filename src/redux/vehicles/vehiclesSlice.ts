import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import vehiclesAPI from '../../api/vehiclesAPI';
import type { RootState } from '../../redux/store';

interface VehicleState {
  vehicles: any[];
  currentVehicle: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  imageStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteImageStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  userVehicles: any[];
  ownerVehicles: any[];
}

const initialState: VehicleState = {
  vehicles: [],
  currentVehicle: null,
  status: 'idle',
  error: null,
  createStatus: 'idle',
  updateStatus: 'idle',
  imageStatus: 'idle',
  deleteImageStatus: 'idle',
  userVehicles: [],
  ownerVehicles: [],
};

export const fetchVehicles = createAsyncThunk('vehicles/fetchVehicles', async () => {
  const response = await vehiclesAPI.getAll();
  return response.data;
});

export const fetchVehicleById = createAsyncThunk('vehicles/fetchVehicleById', async (id: string) => {
  const response = await vehiclesAPI.getById(id);
  return response.data;
});

export const createVehicle = createAsyncThunk('vehicles/createVehicle', async (vehicleData: any) => {
  const response = await vehiclesAPI.create(vehicleData);
  return response.data;
});

export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await vehiclesAPI.update(id, data);
    return response.data;
  },
);

export const partialUpdateVehicle = createAsyncThunk(
  'vehicles/partialUpdateVehicle',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await vehiclesAPI.partialUpdate(id, data);
    return response.data;
  },
);

export const addVehicleImage = createAsyncThunk(
  'vehicles/addVehicleImage',
  async ({ id, image }: { id: string; image: File }) => {
    const response = await vehiclesAPI.addImage(id, image);
    return response.data;
  },
);

export const fetchUserVehicles = createAsyncThunk('vehicles/fetchUserVehicles', async () => {
  const response = await vehiclesAPI.getUserVehicles();
  return Array.isArray(response.data) ? response.data : response.data.results;
});

export const fetchVehiclesByUserId = createAsyncThunk('vehicles/fetchVehiclesByUserId', async (userId: string) => {
  const response = await vehiclesAPI.getVehiclesByUserId(userId);
  return Array.isArray(response.data) ? response.data : response.data.results;
});

export const deleteVehicleImage = createAsyncThunk(
  'vehicles/deleteVehicleImage',
  async ({ vehicleId, imageId }: { vehicleId: string; imageId: string }) => {
    await vehiclesAPI.deleteImage(vehicleId, imageId);
    return imageId;
  },
);

export const deleteVehicle = createAsyncThunk('vehicles/deleteVehicle', async (id: string) => {
  await vehiclesAPI.delete(id);
  return id;
});

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.createStatus = 'idle';
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
    },
    resetImageStatus: (state) => {
      state.imageStatus = 'idle';
    },
    resetDeleteImageStatus: (state) => {
      state.deleteImageStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all vehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vehicles = action.payload.results;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch vehicles';
      })

      .addCase(fetchVehicleById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentVehicle = action.payload;
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch vehicle';
      })

      .addCase(createVehicle.pending, (state) => {
        state.createStatus = 'loading';
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';

        state.vehicles = [action.payload, ...state.vehicles];
        state.userVehicles = [action.payload, ...state.userVehicles];
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.error.message || 'Failed to create vehicle';
      })

      .addCase(updateVehicle.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';

        const index = state.vehicles.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }

        const userIndex = state.userVehicles.findIndex((v) => v.id === action.payload.id);
        if (userIndex !== -1) {
          state.userVehicles[userIndex] = action.payload;
        }

        if (state.currentVehicle?.id === action.payload.id) {
          state.currentVehicle = action.payload;
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.error.message || 'Failed to update vehicle';
      })

      .addCase(partialUpdateVehicle.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(partialUpdateVehicle.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';

        const index = state.vehicles.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.vehicles[index] = { ...state.vehicles[index], ...action.payload };
        }
        const userIndex = state.userVehicles.findIndex((v) => v.id === action.payload.id);
        if (userIndex !== -1) {
          state.userVehicles[userIndex] = { ...state.userVehicles[userIndex], ...action.payload };
        }

        if (state.currentVehicle?.id === action.payload.id) {
          state.currentVehicle = { ...state.currentVehicle, ...action.payload };
        }
      })
      .addCase(partialUpdateVehicle.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.error.message || 'Failed to partially update vehicle';
      })

      .addCase(addVehicleImage.pending, (state) => {
        state.imageStatus = 'loading';
      })
      .addCase(addVehicleImage.fulfilled, (state, action) => {
        state.imageStatus = 'succeeded';
        if (state.currentVehicle) {
          state.currentVehicle.images = state.currentVehicle.images || [];
          state.currentVehicle.images.push(action.payload);
        }
      })
      .addCase(addVehicleImage.rejected, (state, action) => {
        state.imageStatus = 'failed';
        state.error = action.error.message || 'Failed to add vehicle image';
      })

      .addCase(fetchUserVehicles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userVehicles = action.payload;
      })
      .addCase(fetchUserVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user vehicles';
      })

      .addCase(fetchVehiclesByUserId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVehiclesByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ownerVehicles = action.payload;
      })
      .addCase(fetchVehiclesByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch owner vehicles';
      })

      .addCase(deleteVehicleImage.pending, (state) => {
        state.deleteImageStatus = 'loading';
      })
      .addCase(deleteVehicleImage.fulfilled, (state, action) => {
        state.deleteImageStatus = 'succeeded';
        if (state.currentVehicle) {
          state.currentVehicle.images = state.currentVehicle.images.filter((img: any) => img.id !== action.payload);
        }
      })
      .addCase(deleteVehicleImage.rejected, (state, action) => {
        state.deleteImageStatus = 'failed';
        state.error = action.error.message || 'Failed to delete vehicle image';
      })

      .addCase(deleteVehicle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.vehicles = state.vehicles.filter((vehicle) => vehicle.id !== action.payload);

        state.userVehicles = state.userVehicles.filter((vehicle) => vehicle.id !== action.payload);

        if (state.currentVehicle?.id === action.payload) {
          state.currentVehicle = null;
        }
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete vehicle';
      });
  },
});

export const { resetCreateStatus, resetUpdateStatus, resetImageStatus, resetDeleteImageStatus } = vehiclesSlice.actions;

export const selectAllVehicles = (state: RootState) => state.vehicles.vehicles;
export const selectCurrentVehicle = (state: RootState) => state.vehicles.currentVehicle;
export const selectUserVehicles = (state: RootState) => state.vehicles.userVehicles;
export const selectOwnerVehicles = (state: RootState) => state.vehicles.ownerVehicles;
export const selectVehicleStatus = (state: RootState) => state.vehicles.status;
export const selectCreateStatus = (state: RootState) => state.vehicles.createStatus;
export const selectUpdateStatus = (state: RootState) => state.vehicles.updateStatus;
export const selectImageStatus = (state: RootState) => state.vehicles.imageStatus;
export const selectDeleteImageStatus = (state: RootState) => state.vehicles.deleteImageStatus;
export const selectVehicleError = (state: RootState) => state.vehicles.error;

export default vehiclesSlice.reducer;
