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
    getBidsByVendor: builder.query<Bid[], void>({
      query: () => `/bid/me`,
      providesTags: ["Bid"],
    }),
    createBid: builder.mutation<Bid, Partial<Bid>>({
      query: (body) => ({ url: "/bid", method: "POST", body }),
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
  }),
});

export const {
  useGetAllBidsQuery,
  useGetBidsByTenderQuery,
  useGetBidsByVendorQuery,
  useCreateBidMutation,
  useUpdateBidStatusMutation,
} = bidApi;
