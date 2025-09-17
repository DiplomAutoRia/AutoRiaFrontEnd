import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Container, Grid, Typography } from '@mui/material';

import ConversationList from '../../components/messages/ConversationList';
import ConversationView from '../../components/messages/ConversationView';

const MessagesPage: React.FC = () => {
  const { t } = useTranslation();
  const { conversationId } = useParams<{ conversationId?: string }>();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('messages.title')}
      </Typography>

      <Grid container spacing={2} sx={{ height: '600px', maxHeight: '600px' }}>
        <Grid item xs={12} md={conversationId ? 4 : 12}>
          <ConversationList />
        </Grid>

        {conversationId && (
          <Grid item xs={12} md={8}>
            <ConversationView conversationId={parseInt(conversationId)} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default MessagesPage;
