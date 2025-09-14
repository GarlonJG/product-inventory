import { baseApi } from '../../../../shared/lib/baseApi';

export const itemsApi = baseApi.injectEndpoints({
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
  overrideExisting: false,
});

export const {
  useGetItemsQuery,
  useGetItemQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemsApi;
