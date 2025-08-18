import type { Conversation, CreateMessageRequest, Message } from '../../models/message';
import { apiSlice } from './apiSlice';

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => ({
        url: '/user_messages/conversations/',
        method: 'GET',
      }),
      providesTags: ['CONVERSATIONS'],
    }),

    getConversation: builder.query<Message[], number>({
      query: (conversationId) => ({
        url: `/user_messages/conversation/${conversationId}/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, conversationId) => [{ type: 'CONVERSATIONS', id: conversationId }],
    }),

    getConversationInfo: builder.query<Conversation, number>({
      query: (conversationId) => ({
        url: `/user_messages/conversations/${conversationId}/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, conversationId) => [{ type: 'CONVERSATIONS', id: conversationId }],
    }),

    createMessage: builder.mutation<Message, CreateMessageRequest>({
      query: (messageData) => ({
        url: '/user_messages/',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: ['CONVERSATIONS'],
    }),

    getUnreadCount: builder.query<{ unread_count: number }, void>({
      query: () => ({
        url: '/user_messages/unread-count/',
        method: 'GET',
      }),
      providesTags: ['CONVERSATIONS'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useGetConversationInfoQuery,
  useCreateMessageMutation,
  useGetUnreadCountQuery,
} = messagesApi;
