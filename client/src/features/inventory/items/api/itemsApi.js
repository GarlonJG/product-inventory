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
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const tempId = -Date.now();
        const optimistic = { ...item, id: tempId };
        // Optimistically insert the new item at the top of the list
        const patchResult = dispatch(
          itemsApi.util.updateQueryData('getItems', undefined, (draft) => {
            draft.unshift(optimistic);
          })
        );
        try {
          const { data: created } = await queryFulfilled;
          // Replace the optimistic item with the server-created item
          dispatch(
            itemsApi.util.updateQueryData('getItems', undefined, (draft) => {
              const idx = draft.findIndex((i) => i.id === tempId);
              if (idx !== -1) {
                draft[idx] = created;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateItem: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `items/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Item', id }],
      async onQueryStarted({ id, ...updates }, { dispatch, queryFulfilled }) {
        // Optimistically update the list cache
        const patchList = dispatch(
          itemsApi.util.updateQueryData('getItems', undefined, (draft) => {
            const item = draft.find((i) => i.id === id);
            if (item) Object.assign(item, updates);
          })
        );
        // Optimistically update the detail cache if it exists
        let patchDetail;
        try {
          patchDetail = dispatch(
            itemsApi.util.updateQueryData('getItem', id, (draft) => {
              if (draft) Object.assign(draft, updates);
            })
          );
        } catch {
          // getItem cache might not exist; ignore
        }

        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
          if (patchDetail) patchDetail.undo();
        }
      },
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        'Item',
        { type: 'Item', id }
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // 1. Remove item immediately from cache
        console.log("Deleting item from cache")
        const patchResult = dispatch(
          itemsApi.util.updateQueryData('getItems', undefined, (draft) => {
            const idx = draft.findIndex((item) => item.id === id);
            if (idx !== -1) {
              draft.splice(idx, 1);
            }
          })
        );
    
        try {
          // 2. Wait for server response
          await queryFulfilled;
        } catch {
          // 3. If server fails, roll back the change
          patchResult.undo();
        }
      }
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
