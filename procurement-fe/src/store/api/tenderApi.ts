import { baseApi } from "./baseApi";
import type { Tender, CollectionQuery, CollectionResult } from "@/src/types";

export const tenderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenders: builder.query<CollectionResult<Tender>, CollectionQuery>({
      query: (params = {}) => ({ url: "/tender", params }),
      providesTags: ["Tender"],
    }),
    getTender: builder.query<Tender, number>({
      query: (id) => `/tender/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Tender", id }],
    }),
    createTender: builder.mutation<Tender, Partial<Tender>>({
      query: (body) => ({ url: "/tender", method: "POST", body }),
      invalidatesTags: ["Tender"],
    }),
    updateTender: builder.mutation<Tender, { id: number } & Partial<Tender>>({
      query: ({ id, ...body }) => ({
        url: `/tender/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => ["Tender", { type: "Tender", id }],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updated } = await queryFulfilled;
          dispatch(
            tenderApi.util.updateQueryData("getTender", id, () => updated),
          );
        } catch (error) {
          console.error("Failed to update tender:", error);
        }
      },
    }),
    deleteTender: builder.mutation<void, number>({
      query: (id) => ({ url: `/tender/${id}`, method: "DELETE" }),
      invalidatesTags: ["Tender"],
    }),
  }),
});

export const {
  useGetTendersQuery,
  useGetTenderQuery,
  useCreateTenderMutation,
  useUpdateTenderMutation,
  useDeleteTenderMutation,
} = tenderApi;
