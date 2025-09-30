import React from 'react';
import { useParams } from 'react-router-dom';

import { Box, Grid } from '@mui/material';

import ConversationList from '../../components/messages/ConversationList';
import ConversationView from '../../components/messages/ConversationView';
import NotificationsForm from '../../components/notifications/NotificationsForm';
import ProfileLayout from '../../components/profile/ProfileLayout';

const MessagesPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();

  return (
    <ProfileLayout title="Повідомлення" showBreadcrumb={false}>
      <Grid container spacing={2} sx={{ height: '70vh' }}>
        <Grid item xs={12} md={conversationId ? 4 : 12}>
          <ConversationList />
        </Grid>

        {conversationId && (
          <Grid item xs={12} md={8}>
            <ConversationView conversationId={parseInt(conversationId)} />
          </Grid>
        )}
      </Grid>

      {/* Notifications Form */}
      <Box sx={{ mt: 4 }}>
        <NotificationsForm />
      </Box>
    </ProfileLayout>
  );
};

export default MessagesPage;
