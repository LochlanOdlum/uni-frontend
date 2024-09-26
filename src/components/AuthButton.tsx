import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const AuthButton: React.FC<ButtonProps> = (props) => {
  const authToken = useSelector((state: RootState) => state.auth.token);

  // Disable the button if no authToken is present or if the parent component has set disabled to true
  const isDisabled = !authToken || props.disabled;

  return <Button {...props} disabled={isDisabled} />;
};

export default AuthButton;
