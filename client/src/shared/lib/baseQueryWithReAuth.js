import { setCredentials, clearCredentials } from '../../features/auth/authSlice'
import { baseQueryWithErrorHandling } from './baseQueryWithErrorHandling';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
      error ? reject(error) : resolve(token);
    });
    failedQueue = [];
};

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    const baseQuery = baseQueryWithErrorHandling;
    let result = await baseQuery(args, api, extraOptions);
  
    if (result.error && result.error.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
          if (refreshResult.data) {
            api.dispatch(setCredentials({ 
              accessToken: refreshResult.data.accessToken, 
              user: refreshResult.data.user 
            }));
            processQueue(null, refreshResult.data.accessToken);
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(clearCredentials());
            processQueue(refreshResult.error, null);
          }
        } catch (error) {
          api.dispatch(clearCredentials());
          processQueue(error, null);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Queue requests while refreshing
        result = await new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: async () => {
              try {
                const retryResult = await baseQuery(args, api, extraOptions);
                resolve(retryResult);
              } catch (err) {
                reject(err);
              }
            },
            reject,
          });
        });
      }
    }
    return result;
};  