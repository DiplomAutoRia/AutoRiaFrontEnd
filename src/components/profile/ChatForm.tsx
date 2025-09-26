import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ArrowBack, Message as MessageIcon, Person, Send } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
  useGetConversationsQuery,
} from '../../redux/api/messagesApi';
import type { RootState } from '../../redux/store';

interface ChatFormProps {
  compact?: boolean;
}

const ChatForm: React.FC<ChatFormProps> = ({ compact = false }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  // Get conversations list
  const {
    data: conversations,
    isLoading: conversationsLoading,
    error: conversationsError,
  } = useGetConversationsQuery(undefined, {
    pollingInterval: 10000,
    skipPollingIfUnfocused: true,
  });

  // Get selected conversation messages
  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError,
    refetch,
  } = useGetConversationQuery(selectedConversationId!, { skip: !selectedConversationId });

  const { data: conversationInfo } = useGetConversationInfoQuery(selectedConversationId!, {
    skip: !selectedConversationId,
  });

  const [sendMessage, { isLoading: isSending }] = useCreateMessageMutation();

  const {
    isConnected,
    sendMessage: sendWebSocketMessage,
    markAsRead,
  } = useWebSocket({
    onNewMessage: (message: Message) => {
      // We'll handle all messages and filter them by conversation ID in the UI
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
      if (readConversationId === selectedConversationId) {
        refetch();
      }
    },
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays <= 7) {
      return date.toLocaleDateString('uk-UA', {
        weekday: 'short',
      });
    } else {
      return date.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const allMessages = React.useMemo(() => {
    if (!selectedConversationId) return [];

    const apiMessages = messages || [];
    const combined = [...apiMessages, ...localMessages];

    const uniqueMessages = combined.reduce((acc, message) => {
      if (!acc.find((m) => m.id === message.id)) {
        acc.push(message);
      }
      return acc;
    }, [] as Message[]);

    return uniqueMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, localMessages, selectedConversationId]);

  const handleConversationSelect = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setLocalMessages([]);
    markAsRead(conversationId);
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!newMessageText.trim() || !selectedConversationId || !allMessages || allMessages.length === 0) {
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

        sendWebSocketMessage(otherUserMessage.sender, messageText, undefined, selectedConversationId);
      } else {
        await sendMessage({
          receiver: otherUserMessage.sender,
          conversation: selectedConversationId,
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

  const handleVehicleClick = (vehicleId: number) => {
    navigate(`/vehicles/${vehicleId}`);
  };

  const handleViewAllMessages = () => {
    navigate('/messages');
  };

  // Render conversation list
  const renderConversationList = () => {
    if (conversationsLoading) {
      return (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (conversationsError) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Помилка завантаження розмов
        </Alert>
      );
    }

    if (!conversations || conversations.length === 0) {
      return (
        <Box textAlign="center" p={4}>
          <MessageIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Ще немає повідомлень
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ overflow: 'auto', padding: 0 }}>
        {conversations.slice(0, compact ? 3 : conversations.length).map((conversation) => (
          <ListItem
            key={conversation.id}
            button
            onClick={() => handleConversationSelect(conversation.id)}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <Person />
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" noWrap>
                    {conversation.other_user}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(conversation.last_message.timestamp)}
                  </Typography>
                </Box>
              }
              secondary={
                <Box>
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    sx={{
                      mb: 0.5,
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                    noWrap
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVehicleClick(conversation.vehicle);
                    }}
                  >
                    📄 {conversation.vehicle_title}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ maxWidth: conversation.unread_count > 0 ? '60%' : '80%' }}
                    >
                      {conversation.last_message.sender_name === conversation.other_user ? '' : '✓ '}
                      {conversation.last_message.text}
                    </Typography>
                    {conversation.unread_count > 0 && (
                      <Chip
                        label={conversation.unread_count}
                        size="small"
                        color="primary"
                        sx={{ minWidth: 'auto', height: 20, fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  // Render conversation view
  const renderConversationView = () => {
    if (messagesLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      );
    }

    if (messagesError) {
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
      <>
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            height: '60px',
            minHeight: '60px',
            flexShrink: 0,
          }}
        >
          <IconButton onClick={handleBackToList} size="small">
            <ArrowBack />
          </IconButton>
          <Avatar sx={{ width: 32, height: 32 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">
              {allMessages.find((m) => m.sender !== user?.id)?.sender_name || 'Невідомий користувач'}
            </Typography>
            {conversationInfo && (
              <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>
                {conversationInfo.vehicle_title}
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            height: compact ? '200px' : '300px',
            overflow: 'auto',
            p: 1,
            flexShrink: 0,
          }}
        >
          <List sx={{ pb: 0 }}>
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
                  <Box
                    sx={{
                      maxWidth: '80%',
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
        </Box>

        <Divider />
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            p: 1,
            height: '60px',
            minHeight: '60px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', width: '100%' }}>
            <TextField
              fullWidth
              multiline
              maxRows={2}
              size="small"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишіть повідомлення..."
              disabled={isSending}
            />
            <IconButton type="submit" color="primary" disabled={!newMessageText.trim() || isSending} size="small">
              {isSending ? <CircularProgress size={16} /> : <Send />}
            </IconButton>
          </Box>
        </Box>
      </>
    );
  };

  return (
    <Paper
      sx={{
        height: compact ? '400px' : '500px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {!selectedConversationId ? (
        <>
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Чат
            </Typography>
            {compact && (
              <Button variant="outlined" size="small" onClick={handleViewAllMessages}>
                Всі повідомлення
              </Button>
            )}
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto' }}>{renderConversationList()}</Box>
        </>
      ) : (
        renderConversationView()
      )}
    </Paper>
  );
};

export default ChatForm;
