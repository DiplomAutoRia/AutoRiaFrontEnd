import type { Message } from '../models/message';

export const WebSocketMessageType = {
  NEW_MESSAGE: 'new_message',
  MESSAGES_READ: 'messages_read',
  ERROR: 'error',
} as const;

export const WebSocketSendType = {
  CHAT_MESSAGE: 'chat_message',
  MARK_AS_READ: 'mark_as_read',
} as const;

export type WebSocketMessageTypeValues = (typeof WebSocketMessageType)[keyof typeof WebSocketMessageType];

export interface WebSocketMessage {
  type: WebSocketMessageTypeValues;
  message?: Message;
  conversation_id?: number;
  error?: string;
}
