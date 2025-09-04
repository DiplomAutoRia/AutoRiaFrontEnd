import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message 
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Скасувати
        </Button>
        <Button onClick={onConfirm} color="secondary" variant="contained">
          Підтвердити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
