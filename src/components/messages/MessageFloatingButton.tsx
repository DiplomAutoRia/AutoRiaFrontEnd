import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Message as MessageIcon } from '@mui/icons-material';
import { Badge, Fab, useTheme } from '@mui/material';

import { useWebSocket } from '../../hooks/useWebSocket';
import { useGetConversationsQuery } from '../../redux/api/messagesApi';

const MessageFloatingButton: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: conversations, refetch } = useGetConversationsQuery(undefined, {});

  const { isConnected } = useWebSocket({
    onNewMessage: () => {
      refetch();
    },
    onMessagesRead: () => {
      refetch();
    },
  });

  useEffect(() => {
    const count = conversations?.reduce((total, conv) => total + conv.unread_count, 0) || 0;
    setUnreadCount(count);
  }, [conversations]);

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
        border: isConnected ? '2px solid #4caf50' : '2px solid #f44336',
      }}
    >
      <Badge badgeContent={unreadCount} color="error" max={99}>
        <MessageIcon />
      </Badge>
    </Fab>
  );
};

export default MessageFloatingButton;
