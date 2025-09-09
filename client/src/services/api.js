import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'http://localhost:5000/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Item'],
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => 'items',
      providesTags: (result = []) => [
        'Item',
        ...result.map(({ id }) => ({ type: 'Item', id })),
      ],
    }),
    getItem: builder.query({
      query: (id) => `items/${id}`,
      providesTags: (result, error, id) => [{ type: 'Item', id }],
    }),
    addItem: builder.mutation({
      query: (item) => ({
        url: 'items',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Item'],
    }),
    updateItem: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `items/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Item', id }],
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Item', id }],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = api;
