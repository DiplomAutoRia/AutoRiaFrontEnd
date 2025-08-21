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

  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = useGetConversationQuery(conversationId, {
    pollingInterval: 5000,
    skipPollingIfUnfocused: true,
  });

  const { data: conversationInfo } = useGetConversationInfoQuery(conversationId);

  const [sendMessage, { isLoading: isSending }] = useCreateMessageMutation();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessageText.trim() || !messages || messages.length === 0) {
      return;
    }

    const otherUserMessage = messages.find((m) => m.sender !== user?.id);
    if (!otherUserMessage) {
      return;
    }

    try {
      await sendMessage({
        receiver: otherUserMessage.sender,
        conversation: conversationId,
        text: newMessageText.trim(),
      }).unwrap();

      setNewMessageText('');
      refetch();
    } catch {}
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

  if (!messages || messages.length === 0) {
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
            {messages?.find((m) => m.sender !== user?.id)?.sender_name || 'Невідомий користувач'}
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
            {messages ? (messages.length === 1 ? 'Нове повідомлення' : `${messages.length} повідомлень`) : ''}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
        <List>
          {messages.map((message: Message) => {
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
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      display: 'block',
                      textAlign: 'right',
                      mt: 0.5,
                    }}
                  >
                    {formatMessageTime(message.timestamp)}
                  </Typography>
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
            placeholder="Напишіть повідомлення..."
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
