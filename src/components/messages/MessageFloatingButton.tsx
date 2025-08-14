import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Message as MessageIcon } from '@mui/icons-material';
import { Badge, Fab, useTheme } from '@mui/material';

import { useGetConversationsQuery } from '../../redux/api/messagesApi';

const MessageFloatingButton: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: conversations } = useGetConversationsQuery(undefined, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });

  const unreadCount = conversations?.reduce((total, conv) => total + conv.unread_count, 0) || 0;

  const handleClick = () => {
    navigate('/messages');
  };

  return (
    <Fab
      color="primary"
      aria-label="messages"
      onClick={handleClick}
      sx={{
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: 1000,
      }}
    >
      <Badge badgeContent={unreadCount} color="error" max={99}>
        <MessageIcon />
      </Badge>
    </Fab>
  );
};

export default MessageFloatingButton;
