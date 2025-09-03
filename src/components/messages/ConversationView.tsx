import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ArrowBack, DirectionsCar, Send } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import { useWebSocket } from '../../hooks/useWebSocket';
import type { Message } from '../../models/message';
import {
  useCreateMessageMutation,
  useGetConversationInfoQuery,
  useGetConversationQuery,
} from '../../redux/api/messagesApi';
import type { RootState } from '../../redux/store';

interface ConversationViewProps {
  conversationId: number;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversationId }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [newMessageText, setNewMessageText] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  const { data: messages, isLoading, error, refetch } = useGetConversationQuery(conversationId, {});

  const { data: conversationInfo } = useGetConversationInfoQuery(conversationId);

  const [sendMessage, { isLoading: isSending }] = useCreateMessageMutation();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    sendMessage: sendWebSocketMessage,
    markAsRead,
  } = useWebSocket({
    onNewMessage: (message: Message) => {
      setLocalMessages((prev) => {
        const filtered = prev.filter((m) => {
          if (
            m.id > 1000000000000 &&
            m.text === message.text &&
            m.sender === message.sender &&
            Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 5000
          ) {
            return false;
          }
          return m.id !== message.id;
        });

        return [...filtered, message];
      });
    },
    onMessagesRead: (readConversationId: number) => {
      if (readConversationId === conversationId) {
        refetch();
      }
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const allMessages = React.useMemo(() => {
    const apiMessages = messages || [];
    const combined = [...apiMessages, ...localMessages];

    const uniqueMessages = combined.reduce((acc, message) => {
      if (!acc.find((m) => m.id === message.id)) {
        acc.push(message);
      }
      return acc;
    }, [] as Message[]);

    return uniqueMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, localMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  useEffect(() => {
    setLocalMessages([]);
  }, [conversationId]);

  useEffect(() => {
    markAsRead(conversationId);

    if (isConnected) {
      markAsRead(conversationId);
    }
  }, [conversationId, isConnected, markAsRead]);

  useEffect(() => {
    if (allMessages.length > 0) {
      markAsRead(conversationId);
    }
  }, [allMessages.length, conversationId, markAsRead]);

  useEffect(() => {
    if (localMessages.length > 0) {
      markAsRead(conversationId);
    }
  }, [localMessages.length, conversationId, markAsRead]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!newMessageText.trim() || !allMessages || allMessages.length === 0) {
      return;
    }

    const otherUserMessage = allMessages.find((m) => m.sender !== user?.id);
    if (!otherUserMessage) {
      return;
    }

    const messageText = newMessageText.trim();
    setNewMessageText('');

    try {
      if (isConnected) {
        const optimisticMessage: Message = {
          id: Date.now(),
          text: messageText,
          sender: user!.id,
          sender_name: `${user!.first_name} ${user!.last_name}`,
          timestamp: new Date().toISOString(),
          is_read: false,
          vehicle: otherUserMessage.vehicle,
        };

        setLocalMessages((prev) => [...prev, optimisticMessage]);

        sendWebSocketMessage(otherUserMessage.sender, messageText, undefined, conversationId);
      } else {
        await sendMessage({
          receiver: otherUserMessage.sender,
          conversation: conversationId,
          text: messageText,
        }).unwrap();
        refetch();
      }
    } catch (error) {
      setNewMessageText(messageText);
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleVehicleClick = (vehicleId: number) => {
    navigate(`/vehicles/${vehicleId}`);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Помилка завантаження розмови
      </Alert>
    );
  }

  if (!allMessages || allMessages.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Розмову не знайдено
      </Alert>
    );
  }

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <IconButton onClick={() => navigate('/messages')}>
          <ArrowBack />
        </IconButton>
        <Avatar sx={{ width: 32, height: 32 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">
            {allMessages?.find((m) => m.sender !== user?.id)?.sender_name || 'Невідомий користувач'}
          </Typography>
          {conversationInfo && (
            <Box
              onClick={() => handleVehicleClick(conversationInfo.vehicle)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <DirectionsCar fontSize="small" color="primary" />
              <Typography variant="caption" color="primary">
                {conversationInfo.vehicle_title}
              </Typography>
            </Box>
          )}
          <Typography variant="caption" color="text.secondary">
            {allMessages ? (allMessages.length === 1 ? 'Нове повідомлення' : `${allMessages.length} повідомлень`) : ''}
          </Typography>
          {isConnected && (
            <Typography variant="caption" color="success.main">
              • Онлайн
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
        <List>
          {allMessages.map((message: Message) => {
            const isOwnMessage = message.sender === user?.id;

            return (
              <ListItem
                key={message.id}
                sx={{
                  justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                  px: 1,
                  py: 0.5,
                  flexDirection: 'column',
                  alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                }}
              >
                {message.vehicle && (
                  <Box
                    onClick={() => handleVehicleClick(message.vehicle!.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                      p: 1,
                      backgroundColor: 'action.hover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      maxWidth: '70%',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                    }}
                  >
                    <DirectionsCar fontSize="small" color="primary" />
                    <Typography variant="caption" color="primary">
                      {message.vehicle.brand} {message.vehicle.model} {message.vehicle.year}
                    </Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    maxWidth: '70%',
                    backgroundColor: isOwnMessage ? 'primary.main' : 'grey.100',
                    color: isOwnMessage ? 'white' : 'text.primary',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    borderTopLeftRadius: isOwnMessage ? 16 : 4,
                    borderTopRightRadius: isOwnMessage ? 4 : 16,
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.7,
                      }}
                    >
                      {formatMessageTime(message.timestamp)}
                    </Typography>
                    {isOwnMessage && message.id > 1000000000000 && (
                      <Typography variant="caption" sx={{ opacity: 0.5, fontSize: '10px' }}>
                        Відправляється...
                      </Typography>
                    )}
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      <Divider />
      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишіть повідомлення... (Enter - відправити, Shift+Enter - новий рядок)"
            disabled={isSending}
            size="small"
          />
          <IconButton type="submit" color="primary" disabled={!newMessageText.trim() || isSending} sx={{ mb: 0.5 }}>
            {isSending ? <CircularProgress size={20} /> : <Send />}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ConversationView;
