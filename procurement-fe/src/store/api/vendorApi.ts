import { baseApi } from "./baseApi";
import type { Vendor } from "@/src/types";

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<Vendor[], void>({
      query: () => "/vendor",
      providesTags: ["Vendor"],
    }),
    getVendor: builder.query<Vendor, number>({
      query: (id) => `/vendor/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Vendor", id }],
    }),
    getMyVendor: builder.query<Vendor, void>({
      query: () => "/vendor/owner/me",
      providesTags: ["Vendor"],
    }),
    createVendor: builder.mutation<
      Vendor,
      { name: string; registrationNumber: string; email?: string; phoneNumber?: string }
    >({
      query: (body) => ({ url: "/vendor/register", method: "POST", body }),
      invalidatesTags: ["Vendor"],
    }),
    updateVendor: builder.mutation<Vendor, { id: number } & Partial<Vendor>>({
      query: ({ id, ...body }) => ({ url: `/vendor/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Vendor"],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorQuery,
  useGetMyVendorQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
} = vendorApi;
