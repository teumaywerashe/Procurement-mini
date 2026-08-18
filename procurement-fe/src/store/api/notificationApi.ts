import { baseApi } from "./baseApi";

export interface Notification {
  id: number;
  type: string;
  isRead: boolean;
  message: string;
  userId: number;
  tenderId?: number | null;
  bidId?: number | null;
  createdAt: string;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<Notification[], void>({
      query: () => "/notifiaction/me",
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation<Notification, number>({
      query: (id) => ({
        url: `/notifiaction/${id}`,
        method: "PATCH",
        body: { isRead: true },
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
} = notificationApi;
