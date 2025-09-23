import { baseApi } from '../../../shared/lib/baseApi';
import { setCredentials, clearCredentials } from '../authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ 
            accessToken: data.access_token, 
            user: data.user 
          }));
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST'
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        console.log("Client in refresh onQueryStarted")
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.access_token, user: data.user }));
        } catch (error) {
          console.error('Refresh failed:', error);
          dispatch(clearCredentials());
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      }),
      async onQueryStarted(arg, { dispatch }) {
        // Clear all RTK Query cache
        dispatch(baseApi.util.resetApiState());
        dispatch(clearCredentials());
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
} = authApi;

export default authApi;
