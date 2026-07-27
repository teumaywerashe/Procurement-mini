import { baseApi } from "./baseApi";
import type { User, AuthResponse } from "@/src/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<User, { name: string; email: string; password: string }>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
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

export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useUpdateUserMutation } = userApi;
