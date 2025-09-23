import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Message as MessageIcon, Person, ArrowBack, Send } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import { useGetConversationsQuery, useGetConversationQuery, useCreateMessageMutation } from '../../redux/api/messagesApi';
import { useAddNotification } from '../notifications/NotificationSystem';
import type { RootState } from '../../redux/store';

const ProfileChat: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const { notifySystem } = useAddNotification();

  const {
    data: conversations,
    isLoading: conversationsLoading,
    error: conversationsError,
  } = useGetConversationsQuery(undefined, {
    pollingInterval: 10000,
    skipPollingIfUnfocused: true,
  });

  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useGetConversationQuery(selectedConversation!, {
    skip: !selectedConversation,
  });

  const [createMessage, { isLoading: isSending }] = useCreateMessageMutation();

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

  const handleConversationClick = (conversationId: number) => {
    setSelectedConversation(conversationId);
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
    setMessageText('');
  };

  const handleVehicleClick = (e: React.MouseEvent, vehicleId: number) => {
    e.stopPropagation();
    navigate(`/vehicles/${vehicleId}`);
  };

  const handleViewAllMessages = () => {
    navigate('/messages');
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !user) return;

    try {
      // Find the current conversation to get the receiver ID
      const currentConversation = conversations?.find(c => c.id === selectedConversation);
      if (!currentConversation) return;

      // Extract receiver ID from conversation - we need to get the other user's ID
      // Since the conversation object might not have the receiver ID directly,
      // we need to determine who the receiver should be
      // For now, we'll send the message without receiver field if the conversation already exists
      await createMessage({
        conversation: selectedConversation,
        text: messageText.trim(),
      }).unwrap();
      
      setMessageText('');
      refetchMessages();
      
      // Додаємо нотифікацію про успішне надсилання повідомлення
      notifySystem('Повідомлення надіслано', 'Ваше повідомлення успішно надіслано');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render conversation list
  const renderConversationList = () => {
    if (conversationsLoading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
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
          <MessageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Ще немає повідомлень
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Напишіть продавцю, щоб почати розмову
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ overflow: 'auto', padding: 0 }}>
        {conversations.slice(0, 5).map((conversation) => (
          <ListItem
            key={conversation.id}
            button
            onClick={() => handleConversationClick(conversation.id)}
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
                      handleVehicleClick(e, conversation.vehicle);
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

  // Render messages for selected conversation
  const renderMessages = () => {
    if (!selectedConversation) return null;

    const currentConversation = conversations?.find(c => c.id === selectedConversation);

    if (messagesLoading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (messagesError) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Помилка завантаження повідомлень
        </Alert>
      );
    }

    return (
      <>
        {/* Conversation header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <IconButton onClick={handleBackToConversations}>
            <ArrowBack />
          </IconButton>
          <Avatar>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentConversation?.other_user}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentConversation?.vehicle_title}
            </Typography>
          </Box>
        </Box>

        {/* Messages list */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages && messages.length > 0 ? (
            messages.map((message) => {
              const isOwnMessage = message.sender === user?.id;
              return (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      backgroundColor: isOwnMessage ? 'primary.main' : 'grey.100',
                      color: isOwnMessage ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        color: isOwnMessage ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                        mt: 0.5,
                      }}
                    >
                      {formatDate(message.timestamp)}
                    </Typography>
                  </Paper>
                </Box>
              );
            })
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" color="text.secondary">
                Немає повідомлень
              </Typography>
            </Box>
          )}
        </Box>

        {/* Message input */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Напишіть повідомлення..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!messageText.trim() || isSending}
          >
            <Send />
          </IconButton>
        </Box>
      </>
    );
  };

  return (
    <Paper
      sx={{
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {selectedConversation ? (
        // Messages view
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {renderMessages()}
        </Box>
      ) : (
        // Conversations list view
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
              Чати
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              onClick={handleViewAllMessages}
            >
              Всі повідомлення
            </Button>
          </Box>
          
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {renderConversationList()}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ProfileChat;
