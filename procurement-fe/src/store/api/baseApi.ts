import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    // Sends the httpOnly cookie automatically on every request
    credentials: "include",
  }),
  tagTypes: ["Tender", "Bid", "User", "Vendor"],
  endpoints: () => ({}),
});
