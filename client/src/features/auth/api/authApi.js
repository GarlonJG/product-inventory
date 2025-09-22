import { baseApi } from '../../../shared/lib/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          // Removed dispatch(setAuth({ access_token: data.access_token, user: data.user }));
        } catch (error) {
          // Handle login error
          console.error('Login failed:', error);
          throw error;
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch }) {
        // Clear all RTK Query cache
        dispatch(baseApi.util.resetApiState());
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
} = authApi;

export default authApi;
