import { baseQuery } from './baseQuery';

export const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // Handle specific error statuses
    if (result.error) {
      const { status, data } = result.error;
      
      // If we have a structured error response from the server, use that
      if (data && typeof data === 'object' && data.message) {
        return {
          ...result,
          error: {
            ...result.error,
            data: {
              message: data.message,
              errors: data.errors || [],
              statusCode: data.statusCode || status
            }
          }
        };
      }
      
      // Handle generic HTTP errors
      const errorMessages = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        500: 'Internal Server Error'
      };
      
      return {
        ...result,
        error: {
          ...result.error,
          data: {
            message: errorMessages[status] || 'An error occurred',
            statusCode: status
          }
        }
      };
    }
    return result;
};