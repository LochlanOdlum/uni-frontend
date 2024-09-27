import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSignupMutation } from '../redux/services/api';
import { setCredentials } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../redux/store';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useSnackbar } from 'notistack';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   // Add other fields if necessary
// }

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [signup, { isLoading, error }] = useSignupMutation();

  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userData = await signup({ name, email, password }).unwrap();
      dispatch(setCredentials({ user: userData }));
      enqueueSnackbar('Activity was successful!', { variant: 'success' });
      navigate('/signin'); 
    } catch (err) {
      enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
      console.error('Failed to sign up:', err);
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if ((error as FetchBaseQueryError).data) {
      const errData = (error as FetchBaseQueryError).data as { message?: string };
      return errData.message || 'Failed to sign up';
    }
    return 'Failed to sign up';
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      {error && <Alert severity="error">{getErrorMessage(error)}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          value={email}
          onChange={handleChange}
          type="email"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          value={password}
          onChange={handleChange}
          type="password"
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </form>
    </Container>
  );
};

export default SignUp;
