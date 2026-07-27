import { baseApi } from "./baseApi";
import type { Tender } from "@/src/types";

export const tenderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenders: builder.query<Tender[], { title?: string; estimatedValue?: number }>({
      query: (params = {}) => ({ url: "/tender/all", params }),
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
      query: ({ id, ...body }) => ({ url: `/tender/${id}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Tender", id }],
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
