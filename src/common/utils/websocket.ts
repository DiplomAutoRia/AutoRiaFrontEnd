import type { Message } from '../../models/message';
import { type WebSocketMessageTypeValues, WebSocketSendType } from '../../types/websocket';

export interface WebSocketMessage {
  type: WebSocketMessageTypeValues;
  message?: Message;
  conversation_id?: number;
  error?: string;
}

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private userId: number;
  private onMessage: (_data: WebSocketMessage) => void;
  private onConnect?: () => void;
  private onDisconnect?: () => void;
  private onError?: () => void;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(
    userId: number,
    onMessage: (_data: WebSocketMessage) => void,
    options?: {
      onConnect?: () => void;
      onDisconnect?: () => void;
      onError?: () => void;
    },
  ) {
    this.userId = userId;
    this.onMessage = onMessage;
    this.onConnect = options?.onConnect;
    this.onDisconnect = options?.onDisconnect;
    this.onError = options?.onError;
  }

  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = `ws://localhost:8000/ws/chat/${this.userId}/`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log(`WebSocket connected for user ${this.userId}`);
      this.reconnectAttempts = 0;
      this.onConnect?.();
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        console.log(`WebSocket message received for user ${this.userId}:`, data);
        this.onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log(`WebSocket disconnected for user ${this.userId}`);
      this.onDisconnect?.();
      this.attemptReconnect();
    };

    this.ws.onerror = () => {
      console.error(`WebSocket error for user ${this.userId}`);
      this.onError?.();
    };
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendMessage(receiverId: number, message: string, vehicleId?: number, conversationId?: number): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (!message.trim()) {
        console.error('Cannot send empty message');
        return;
      }

      if (receiverId === this.userId) {
        console.error('Cannot send message to yourself');
        return;
      }

      this.ws.send(
        JSON.stringify({
          type: WebSocketSendType.CHAT_MESSAGE,
          message: message.trim(),
          receiver_id: receiverId,
          vehicle_id: vehicleId,
          conversation_id: conversationId,
        }),
      );
    } else {
      console.error('WebSocket is not connected');
      throw new Error('WebSocket is not connected');
    }
  }

  markAsRead(conversationId: number): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log(`Marking conversation ${conversationId} as read for user ${this.userId}`);
      this.ws.send(
        JSON.stringify({
          type: WebSocketSendType.MARK_AS_READ,
          conversation_id: conversationId,
        }),
      );
    } else {
      console.log(`Cannot mark as read - WebSocket not connected for user ${this.userId}`);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts - 1) * 1000;

      console.log(
        `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );

      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
