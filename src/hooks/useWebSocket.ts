import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { ChatWebSocket, type WebSocketMessage } from '../common/utils/websocket';
import type { Message } from '../models/message';
import type { RootState } from '../redux/store';
import { WebSocketMessageType } from '../types/websocket';

interface UseWebSocketOptions {
  onNewMessage?: (_message: Message) => void;
  onMessagesRead?: (_conversationId: number) => void;
  onError?: (_error: string) => void;
}

export const useWebSocket = (options?: UseWebSocketOptions) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const wsRef = useRef<ChatWebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
      setIsConnected(false);
      setConnectionError(null);
    }

    if (!user?.id) {
      return;
    }

    const handleMessage = (data: WebSocketMessage) => {
      switch (data.type) {
        case WebSocketMessageType.NEW_MESSAGE:
          if (data.message) {
            options?.onNewMessage?.(data.message);
          }
          break;
        case WebSocketMessageType.MESSAGES_READ:
          if (data.conversation_id) {
            options?.onMessagesRead?.(data.conversation_id);
          }
          break;
        case WebSocketMessageType.ERROR:
          const errorMessage = data.error || 'Unknown WebSocket error';
          setConnectionError(errorMessage);
          options?.onError?.(errorMessage);
          break;
      }
    };

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleError = () => {
      setConnectionError('WebSocket connection failed');
      setIsConnected(false);
    };

    wsRef.current = new ChatWebSocket(user.id, handleMessage, {
      onConnect: handleConnect,
      onDisconnect: handleDisconnect,
      onError: handleError,
    });

    wsRef.current.connect();

    return () => {
      wsRef.current?.disconnect();
      wsRef.current = null;
      setIsConnected(false);
    };
  }, [user?.id]);

  const sendMessage = (receiverId: number, message: string, vehicleId?: number, conversationId?: number) => {
    if (wsRef.current) {
      wsRef.current.sendMessage(receiverId, message, vehicleId, conversationId);
    }
  };

  const markAsRead = (conversationId: number) => {
    if (wsRef.current) {
      wsRef.current.markAsRead(conversationId);
    } else {
      console.log(`WebSocket not available to mark conversation ${conversationId} as read`);
    }
  };

  return {
    isConnected,
    connectionError,
    sendMessage,
    markAsRead,
  };
};
