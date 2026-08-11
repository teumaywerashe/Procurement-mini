import { baseApi } from "./baseApi";
import type { User, AuthResponse } from "@/src/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<
      AuthResponse,
      { name: string; email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["User", "Bid", "Vendor"],
    }),
    getMe: builder.query<User, void>({
      query: () => "/user/me",
      providesTags: ["User"],
    }),
    getUsers: builder.query<User[], void>({
      query: () => "/user",
      providesTags: ["User"],
    }),
    createUser: builder.mutation<
      User,
      { name: string; email: string; password: string; role?: string }
    >({
      query: (body) => ({
        url: "/user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<User, { id: number } & Partial<User>>({
      query: ({ id, ...body }) => ({
        url: `/user/${id}/profile`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateUserRole: builder.mutation<User, { id: number; role: string }>({
      query: ({ id, role }) => ({
        url: `/user/${id}/role`,
        method: "POST",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<{ success: boolean; message: string }, number>(
      {
        query: (id) => ({
          url: `/user/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["User"],
      },
    ),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = userApi;
