import { baseApi } from '../../../shared/lib/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
        } catch (error) {
          // Handle login error
          console.error('Login failed:', error);
          throw error;
        }
      },
    }),
    getProfile: builder.query({
      query: () => '/auth/profile',
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch }) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        // Clear all RTK Query cache
        dispatch(baseApi.util.resetApiState());
        window.location.href = '/login';
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useLogoutMutation,
} = authApi;

// Helper function to check authentication status
export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token; // Returns true if token exists, false otherwise
};

// Add request interceptor to include the auth token in requests
const originalBaseQuery = baseApi.util.getRunningOperationPromises;
baseApi.util.getRunningOperationPromises = (...args) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    baseApi.util.updateQueryData(
      'getProfile',
      undefined,
      (draft) => {
        if (draft) return draft;
        return baseApi.util.getRunningOperationPromises(...args);
      },
      { updateQueryData: { track: false } }
    );
  }
  return originalBaseQuery(...args);
};

// Add response interceptor to handle 401 Unauthorized responses
baseApi.util.getRunningOperationPromises = (...args) => {
  const result = originalBaseQuery(...args);
  
  if (result instanceof Promise) {
    return result.catch((error) => {
      if (error.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw error;
    });
  }
  
  return result;
};

export default authApi;
