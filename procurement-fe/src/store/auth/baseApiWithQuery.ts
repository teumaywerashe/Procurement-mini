import {
  fetchBaseQuery,
  type FetchBaseQueryError,
  type FetchArgs,
  type BaseQueryFn,
} from "@reduxjs/toolkit/query";

import { logOut } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(logOut());
  }

  return result;
};
