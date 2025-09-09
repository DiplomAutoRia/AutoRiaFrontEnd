import type { Favorite, FavoriteCreateRequest, FavoriteWithVehicle } from '../../models/favorite';
import { routes } from '../../routes';
import { apiSlice } from './apiSlice';

export const favoritesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<FavoriteWithVehicle[], void>({
      query: () => routes.API.FAVORITES,
      providesTags: ['FAVORITES'],
    }),

    addToFavorites: builder.mutation<Favorite, FavoriteCreateRequest>({
      query: (favoriteData) => ({
        url: routes.API.FAVORITES,
        method: 'POST',
        body: favoriteData,
      }),
      invalidatesTags: ['FAVORITES'],
    }),

    removeFromFavorites: builder.mutation<void, number>({
      query: (favoriteId) => ({
        url: `${routes.API.FAVORITES}${favoriteId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FAVORITES'],
    }),
  }),
});

export const { useGetFavoritesQuery, useAddToFavoritesMutation, useRemoveFromFavoritesMutation } = favoritesApi;
