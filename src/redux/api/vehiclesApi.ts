import type {
  Vehicle,
  VehicleCreateRequest,
  VehicleFilters,
  VehicleImage,
  VehicleListResponse,
} from '../../models/vehicle';
import { routes } from '../../routes';
import { apiSlice } from './apiSlice';

export const vehiclesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query<VehicleListResponse, VehicleFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              params.append(key, value.join(','));
            } else {
              params.append(key, value.toString());
            }
          }
        });
        return `${routes.API.VEHICLES}/?${params.toString()}`;
      },
      providesTags: ['VEHICLES'],
    }),

    getVehicle: builder.query<Vehicle, number>({
      query: (id) => `${routes.API.VEHICLES}/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'VEHICLES', id }],
    }),

    createVehicle: builder.mutation<Vehicle, VehicleCreateRequest>({
      query: (vehicleData) => {
        const formData = new FormData();

        Object.entries(vehicleData).forEach(([key, value]) => {
          if (key === 'uploaded_images' && Array.isArray(value)) {
            value.forEach((file) => {
              formData.append('uploaded_images', file);
            });
          } else if (value !== undefined && value !== null && value !== '') {
            formData.append(key, value.toString());
          }
        });

        return {
          url: `${routes.API.VEHICLES}/`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['VEHICLES'],
    }),

    updateVehicle: builder.mutation<Vehicle, { id: number; data: Partial<VehicleCreateRequest> }>({
      query: ({ id, data }) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (key === 'uploaded_images' && Array.isArray(value)) {
            value.forEach((file) => {
              formData.append('uploaded_images', file);
            });
          } else if (value !== undefined && value !== null && value !== '') {
            formData.append(key, value.toString());
          }
        });

        return {
          url: `${routes.API.VEHICLES}/${id}/`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'VEHICLES', id }, 'VEHICLES'],
    }),

    deleteVehicle: builder.mutation<void, number>({
      query: (id) => ({
        url: `${routes.API.VEHICLES}/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['VEHICLES'],
    }),

    searchVehicles: builder.query<VehicleListResponse, { q: string; page?: number; limit?: number }>({
      query: ({ q, page = 1, limit = 10 }) => {
        const params = new URLSearchParams({
          q,
          page: page.toString(),
          limit: limit.toString(),
        });
        return `${routes.API.VEHICLES}/search/?${params.toString()}`;
      },
      providesTags: ['VEHICLES'],
    }),

    getMyVehicles: builder.query<VehicleListResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        return `${routes.API.VEHICLES}/my-vehicles/?${params.toString()}`;
      },
      providesTags: ['VEHICLES'],
    }),

    addVehicleImage: builder.mutation<VehicleImage, { vehicleId: number; image: File }>({
      query: ({ vehicleId, image }) => {
        const formData = new FormData();
        formData.append('image', image);

        return {
          url: `${routes.API.VEHICLES}/${vehicleId}/add-image/`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { vehicleId }) => [{ type: 'VEHICLES', id: vehicleId }],
    }),

    deleteVehicleImage: builder.mutation<void, { vehicleId: number; imageId: number }>({
      query: ({ vehicleId, imageId }) => ({
        url: `${routes.API.VEHICLES}/${vehicleId}/delete-image/${imageId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { vehicleId }) => [{ type: 'VEHICLES', id: vehicleId }],
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useGetVehicleQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useSearchVehiclesQuery,
  useGetMyVehiclesQuery,
  useAddVehicleImageMutation,
  useDeleteVehicleImageMutation,
} = vehiclesApi;