// ConfirmableDelete.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

interface ConfirmableDeleteProps {
  handleDelete: () => void;  
  children: React.ReactNode; 
  disabled?: boolean
}

const ConfirmableDelete: React.FC<ConfirmableDeleteProps> = ({ handleDelete, children, disabled }) => {
  const [open, setOpen] = useState(false);

  const openDialog = () => disabled || setOpen(true);
  const closeDialog = () => setOpen(false);

  const handleConfirm = () => {
    handleDelete();
    closeDialog();
  };

  return (
    <>
      {/* Wrap the trigger button */}
      <span onClick={openDialog}>{children}</span>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmableDelete;
