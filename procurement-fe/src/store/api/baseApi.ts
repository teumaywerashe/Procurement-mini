import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../auth/baseApiWithQuery";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithAuth,

  tagTypes: ["Tender", "Bid", "User", "Vendor", "Notification"],

  endpoints: () => ({}),
});
