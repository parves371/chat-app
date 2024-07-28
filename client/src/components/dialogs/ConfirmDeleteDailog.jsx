import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

const ConfirmDeleteDailog = ({ open, handleclose, deleteHandler }) => {
  return (
    <Dialog open={open} onClose={handleclose}>
      <DialogTitle> Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are You Sure want to delete This Group
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleclose}>no</Button>
        <Button color="error" onClick={deleteHandler}>
          yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDailog;
