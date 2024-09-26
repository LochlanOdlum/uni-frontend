import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const AdminButton: React.FC<ButtonProps> = (props) => {
  const role = useSelector((state: RootState) => state.auth?.user?.role);

  // Make the button invisible if role is not admin/root
  const isDisabled = !role || (role !== "admin" && role !== "root");

  return <Button variant={"contained"} color={"error"} sx={{visibility: isDisabled ? 'hidden' : 'visible'}} {...props}/>;
};

export default AdminButton;
