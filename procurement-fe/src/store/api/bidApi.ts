/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import type { Bid } from "@/src/types";

export const bidApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBids: builder.query<Bid[], void>({
      query: () => "/bid",
      providesTags: ["Bid"],
    }),
    getBidById: builder.query<Bid, number>({
      query: (id) => `/bid/${id}`,
      providesTags: ["Bid"],
    }),
    getBidsByTender: builder.query<Bid[], number>({
      query: (tenderId) => `/bid/tender/${tenderId}`,
      providesTags: ["Bid"],
    }),
    getBidsByVendor: builder.query<Bid[], void>({
      query: () => `/bid/me`,
      providesTags: ["Bid"],
    }),
    createBid: builder.mutation<Bid, Partial<Bid>>({
      query: (body) => ({ url: "/bid", method: "POST", body }),
      invalidatesTags: ["Bid"],
    }),
    updateBid: builder.mutation<Bid, { id: number; amount?: number; proposedPrice?: number; proposal?: string; notes?: string; bidStatus?: string }>({
      query: ({ id, ...body }) => ({
        url: `/bid/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Bid"],
    }),
    updateBidStatus: builder.mutation<Bid, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/bid/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Bid"],
    }),
    deleteBid: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/bid/${id}`, method: "DELETE" }),
      invalidatesTags: ["Bid"],
    }),
    uploadBidDocument: builder.mutation<any, { bidId: number; file: File }>({
      query: ({ bidId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/documents/bid/${bidId}`,
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["Bid"],
    }),
    getBidDocuments: builder.query<any[], number>({
      query: (bidId) => `/documents/bid/${bidId}`,
      providesTags: ["Bid"],
    }),
  }),
});

export const {
  useGetAllBidsQuery,
  useGetBidByIdQuery,
  useGetBidsByTenderQuery,
  useGetBidsByVendorQuery,
  useCreateBidMutation,
  useUpdateBidMutation,
  useUpdateBidStatusMutation,
  useDeleteBidMutation,
  useUploadBidDocumentMutation,
  useGetBidDocumentsQuery,
} = bidApi;
