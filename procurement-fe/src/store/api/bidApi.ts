import { baseApi } from "./baseApi";
import type { Bid } from "@/src/types";

export const bidApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBids: builder.query<Bid[], void>({
      query: () => "/bid",
      providesTags: ["Bid"],
    }),
    getBidsByTender: builder.query<Bid[], number>({
      query: (tenderId) => `/bid/tender/${tenderId}`,
      providesTags: ["Bid"],
    }),
    getBidsByVendor: builder.query<Bid[], number>({
      query: (vendorId) => `/bid/vendor/${vendorId}`,
      providesTags: ["Bid"],
    }),
    createBid: builder.mutation<Bid, Partial<Bid>>({
      query: (body) => ({ url: "/bid", method: "POST", body }),
      invalidatesTags: ["Bid"],
    }),
    updateBid: builder.mutation<Bid, { id: number } & Partial<Bid>>({
      query: ({ id, ...body }) => ({
        url: `/bid/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Bid"],
    }),
  }),
});

export const {
  useGetAllBidsQuery,
  useGetBidsByTenderQuery,
  useGetBidsByVendorQuery,
  useCreateBidMutation,
  useUpdateBidMutation,
} = bidApi;
