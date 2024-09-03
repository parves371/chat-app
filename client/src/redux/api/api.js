import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";
import { setIsNewGroup } from "../reducers/misc";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/`,
  }),
  tagTypes: ["Chat", "User", "Message"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chat/get-my-chats",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: `user/send-request`,
        method: "put",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    getNotifications: builder.query({
      query: () => ({
        url: "user/notification",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: `user/accept-request`,
        method: "put",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += "?populate=true";

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/messages/${chatId}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    sendAtTachments: builder.mutation({
      query: (data) => ({
        url: `chat/send-attachment`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    myGroups: builder.query({
      query: () => ({
        url: "chat/get-my-groups",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    availableFriendsDetails: builder.query({
      query: (chatId) => {
        let url = `user/get-my-friends`;
        if (chatId) url += `?chatId=${chatId}`;

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    newGroup: builder.mutation({
      query: ({ name, members }) => ({
        url: `chat/new-chat`,
        method: "POST",
        body: { name, members },
        credentials: "include",
      }),
    }),
    renameGroup: builder.mutation({
      query: ({ chatId, name }) => ({
        url: `chat/${chatId}`,
        method: "PUT",
        body: { name },
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    removeGroupMember: builder.mutation({
      query: ({ chatId, userId }) => ({
        url: `chat/remove-member`,
        method: "PUT",
        body: { chatId, userId },
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    addGroupMember: builder.mutation({
      query: ({ chatId, members = [] }) => ({
        url: `chat/addmember`,
        method: "PUT",
        body: { chatId, members },
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    deleteChat: builder.mutation({
      query: ({ chatId, name }) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export default api;

export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useGetMessagesQuery,
  useSendAtTachmentsMutation,
  useMyGroupsQuery,
  useAvailableFriendsDetailsQuery,
  useNewGroupMutation,
  useRenameGroupMutation,
  useRemoveGroupMemberMutation,
  useAddGroupMemberMutation,
  useDeleteChatMutation,
} = api;
