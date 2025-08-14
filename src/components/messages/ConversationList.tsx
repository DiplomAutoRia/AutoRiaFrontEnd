import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Message as MessageIcon, Person } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';

import { useGetConversationsQuery } from '../../redux/api/messagesApi';

const ConversationList: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: conversations,
    isLoading,
    error,
  } = useGetConversationsQuery(undefined, {
    pollingInterval: 10000,
    skipPollingIfUnfocused: true,
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

  const handleConversationClick = (conversationId: number) => {
    navigate(`/messages/${conversationId}`);
  };

  const handleVehicleClick = (e: React.MouseEvent, vehicleId: number) => {
    e.stopPropagation();
    navigate(`/vehicles/${vehicleId}`);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
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
    <Paper sx={{ height: '100%' }}>
      <List>
        {conversations.map((conversation) => (
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
                  <Typography variant="subtitle1" noWrap>
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
                    onClick={(e) => handleVehicleClick(e, conversation.vehicle)}
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
    </Paper>
  );
};

export default ConversationList;
