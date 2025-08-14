import React, { useState } from 'react';

import { Close, Send } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';

import type { Vehicle } from '../../models/vehicle';
import { useCreateMessageMutation } from '../../redux/api/messagesApi';

interface MessageModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  receiverId: number;
}

const MessageModal: React.FC<MessageModalProps> = ({ open, onClose, vehicle, receiverId }) => {
  const [messageText, setMessageText] = useState('');
  const [createMessage, { isLoading, error }] = useCreateMessageMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim()) {
      return;
    }

    try {
      await createMessage({
        receiver: receiverId,
        vehicle: vehicle.id,
        text: messageText.trim(),
      }).unwrap();

      setMessageText('');
      onClose();
    } catch {
    }
  };

  const handleClose = () => {
    setMessageText('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Написати продавцю</Typography>
          <Button onClick={handleClose} size="small">
            <Close />
          </Button>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              Стосовно: {vehicle.brand} {vehicle.model} {vehicle.year}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Помилка надсилання повідомлення. Спробуйте ще раз.
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Ваше повідомлення"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Напишіть своє повідомлення продавцю..."
            disabled={isLoading}
            autoFocus
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!messageText.trim() || isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : <Send />}
          >
            {isLoading ? 'Надсилання...' : 'Надіслати'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MessageModal;
