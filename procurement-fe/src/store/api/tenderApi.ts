/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import type { Tender, CollectionQuery, CollectionResult } from "@/src/types";

export const tenderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenders: builder.query<CollectionResult<Tender>, CollectionQuery>({
      query: (params = {}) => ({ url: "/tender", params }),
      providesTags: ["Tender"],
    }),
    getTender: builder.query<Tender, number>({
      query: (id) => `/tender/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Tender", id }],
    }),
    createTender: builder.mutation<Tender, Partial<Tender>>({
      query: (body) => ({ url: "/tender", method: "POST", body }),
      invalidatesTags: ["Tender"],
    }),
    updateTender: builder.mutation<Tender, { id: number } & Partial<Tender>>({
      query: ({ id, ...body }) => ({
        url: `/tender/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => ["Tender", { type: "Tender", id }],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updated } = await queryFulfilled;
          dispatch(
            tenderApi.util.updateQueryData("getTender", id, () => updated),
          );
        } catch (error) {
          console.error("Failed to update tender:", error);
        }
      },
    }),
    deleteTender: builder.mutation<void, number>({
      query: (id) => ({ url: `/tender/${id}`, method: "DELETE" }),
      invalidatesTags: ["Tender"],
    }),
    uploadTenderDocument: builder.mutation<
      any,
      { tenderId: number; file: File }
    >({
      query: ({ tenderId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/documents/tender/${tenderId}`,
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: (_r, _e, { tenderId }) => [
        "Tender",
        { type: "Tender", id: tenderId },
      ],
    }),
    getTenderDocuments: builder.query<any[], number>({
      query: (tenderId) => `/documents/tender/${tenderId}`,
      providesTags: (_r, _e, tenderId) => [
        "Tender",
        { type: "Tender", id: tenderId },
      ],
    }),
    getDocumentPresignedUrl: builder.query<{ url: string; fileName: string }, number>({
      query: (docId) => `/documents/${docId}/url`,
    }),
    deleteDocument: builder.mutation<void, number>({
      query: (docId) => ({
        url: `/documents/${docId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tender", "Bid"],
    }),
  }),
});

export const {
  useGetTendersQuery,
  useGetTenderQuery,
  useCreateTenderMutation,
  useUpdateTenderMutation,
  useDeleteTenderMutation,
  useUploadTenderDocumentMutation,
  useGetTenderDocumentsQuery,
  useGetDocumentPresignedUrlQuery,
  useLazyGetDocumentPresignedUrlQuery,
  useDeleteDocumentMutation,
} = tenderApi;
