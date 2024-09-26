// src/redux/services/api.ts

import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { paths, operations, components } from '../../types/api';
import type { RootState } from '../store';
import { logout } from '../slices/authSlice';

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Initialize fetchBaseQuery with your settings
  const rawBaseQuery = fetchBaseQuery({
    // baseUrl: 'http://localhost:8000',
    baseUrl: 'http://35.178.201.94:80/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await rawBaseQuery(args, api, extraOptions);

  // If 401 Unauthorized then logout the user, as it is assumed if any credentials exist they have now expired.
  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api', 
  baseQuery: baseQuery,
  tagTypes: ['User', 'Location', 'Home', 'Distance', 'Auth'],
  endpoints: (builder) => ({
    // Auth Endpoints
    signup: builder.mutation<
      components['schemas']['UserRead'], 
      components['schemas']['UserCreate']
    >({
      query: (user) => ({
        url: 'auth/signup',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Auth'],
    }),
    signin: builder.mutation<
      components['schemas']['SignInResponse'],
      components['schemas']['UserSignIn']
    >({
      query: (credentials) => ({
        url: 'auth/signin',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // User Management Endpoints
    getUsers: builder.query<
      components['schemas']['UserRead'][],
      void
    >({
      query: () => 'users/',
      providesTags: ['User'],
    }),
    updateUsers: builder.mutation<
    components['schemas']['UserRead'],
    { user_id: number; data: components['schemas']['UserUpdate'] }
    >({
      query: ({ user_id, data }) => ({
        url: `users/${user_id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<
      void,
      number // user_id
    >({
      query: (user_id) => ({
        url: `users/${user_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Location Endpoints
    getLocations: builder.query<
      components['schemas']['LocationRead'][],
      { skip?: number; limit?: number } | undefined
    >({
      query: (params) => ({
        url: 'locations/',
        params,
      }),
      providesTags: ['Location'],
    }),
    createLocation: builder.mutation<
      components['schemas']['LocationRead'],
      components['schemas']['LocationCreate']
    >({
      query: (newLocation) => ({
        url: 'locations/',
        method: 'POST',
        body: newLocation,
      }),
      invalidatesTags: ['Location'],
    }),
    getLocationById: builder.query<
      components['schemas']['LocationRead'],
      number // location_id
    >({
      query: (location_id) => `locations/${location_id}`,
      providesTags: (result, error, location_id) => [{ type: 'Location', id: location_id }],
    }),
    updateLocation: builder.mutation<
    components['schemas']['LocationRead'],
    { location_id: number; data: components['schemas']['LocationCreate'] }
    >({
      query: ({ location_id, data }) => ({
        url: `locations/${location_id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { location_id }) => [{ type: 'Location', id: location_id }],
    }),
    deleteLocation: builder.mutation<
      void,
      number // location_id
    >({
      query: (location_id) => ({
        url: `locations/${location_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Location'],
    }),

    // Home Endpoints
    getHomes: builder.query<
      components['schemas']['HomeRead'][],
      { skip?: number; limit?: number } | undefined
    >({
      query: (params) => ({
        url: 'homes/',
        params,
      }),
      providesTags: ['Home'],
    }),
    createHome: builder.mutation<
      components['schemas']['HomeRead'],
      components['schemas']['HomeCreate']
    >({
      query: (newHome) => ({
        url: 'homes/',
        method: 'POST',
        body: newHome,
      }),
      invalidatesTags: ['Home'],
    }),
    deleteHome: builder.mutation<
      void,
      number // home_id
    >({
      query: (home_id) => ({
        url: `homes/${home_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Home'],
    }),
    getHomeById: builder.query<
    components['schemas']['HomeRead'],
    number // home_id
  >({
    query: (home_id) => `homes/${home_id}`,
    providesTags: (result, error, home_id) => [{ type: 'Home', id: home_id }],
  }),
  updateHome: builder.mutation<
  components['schemas']['HomeRead'],
  { home_id: number; data: components['schemas']['HomeCreate'] }
  >({
    query: ({ home_id, data }) => ({
      url: `homes/${home_id}`,
      method: 'PUT',
      body: data,
    }),
    invalidatesTags: (result, error, { home_id }) => [{ type: 'Home', id: home_id }],
  }),

    // Distance Endpoints
    getDistances: builder.query<
      components['schemas']['DistanceRead'][],
      number // home_id
    >({
      query: (home_id) => `homes/${home_id}/distances`,
      providesTags: ['Distance'],
    }),

    // Geocode search
    searchGeocode: builder.query<
      components['schemas']['GeocodeSearchOutput'],
      components['schemas']['GeocodeSearchInput']
    >({
      query: (searchInput) => ({
        url: '/geocode/search',
        method: 'POST',
        body: searchInput,
      }),
    }),

    // Root Endpoint
    getRoot: builder.query<
      unknown,
      void
    >({
      query: () => '/',
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useSignupMutation,
  useSigninMutation,
  useGetUsersQuery,
  useUpdateUsersMutation,
  useDeleteUserMutation,
  useGetLocationsQuery,
  useCreateLocationMutation,
  useGetLocationByIdQuery,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useGetHomesQuery,
  useGetHomeByIdQuery,
  useCreateHomeMutation,
  useUpdateHomeMutation,
  useDeleteHomeMutation,
  useGetDistancesQuery,
  useLazySearchGeocodeQuery,
  useGetRootQuery,
} = api;
