import React from 'react';
import { useParams } from 'react-router-dom';

import { Box, Container, Grid, Typography } from '@mui/material';

import ConversationList from '../../components/messages/ConversationList';
import ConversationView from '../../components/messages/ConversationView';

const MessagesPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Повідомлення
      </Typography>

      <Grid container spacing={2} sx={{ height: '70vh' }}>
        <Grid item xs={12} md={conversationId ? 4 : 12}>
          <ConversationList />
        </Grid>

        {conversationId && (
          <Grid item xs={12} md={8}>
            <ConversationView conversationId={parseInt(conversationId)} />
          </Grid>
        )}

        {!conversationId && (
          <Grid item xs={12} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.50',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Оберіть розмову для перегляду
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default MessagesPage;
