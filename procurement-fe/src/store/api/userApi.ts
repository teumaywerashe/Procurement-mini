import { baseApi } from "./baseApi";
import type { User, AuthResponse } from "@/src/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<AuthResponse, { name: string; email: string; password: string }>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["User", "Tender", "Bid", "Vendor"],
    }),
    getMe: builder.query<User, void>({
      query: () => "/user/me",
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<User, { id: number } & Partial<User>>({
      query: ({ id, ...body }) => ({ url: `/user/${id}`, method: "PATCH", body }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateUserMutation,
} = userApi;
