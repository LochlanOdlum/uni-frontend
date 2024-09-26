import React, { useState, useEffect } from 'react';
import {
  useGetUsersQuery,
  useUpdateUsersMutation,
  useDeleteUserMutation,
} from '../redux/services/api'; 
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { components } from '../types/api';

type User = components['schemas']['UserRead'];
type UserUpdate = components['schemas']['UserUpdate'];

const UserManagement: React.FC = () => {
  const { data: users, error, isLoading } = useGetUsersQuery();
  const [updateUser] = useUpdateUsersMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'user' | 'admin' | 'root'>('user');

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setRole(selectedUser.role);
    }
  }, [selectedUser]);

  const handleEditUser = (user: User) => {
    if (user.role === 'root') {
      alert('Root users cannot be edited.');
      return;
    }
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleDeleteUser = async (userId: number, userRole: string) => {
    if (userRole === 'root') {
      alert('Root users cannot be deleted.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
      } catch (err) {
        console.error(err);
        alert('Failed to delete user');
      }
    }
  };

  const handlePromoteDemote = async (user: User) => {
    if (user.role === 'root') {
      alert('Root users cannot be promoted or demoted.');
      return;
    }
    const newRole = user.role === 'user' ? 'admin' : 'user';
    const updatedUser: UserUpdate = {
      name: user.name,
      email: user.email,
      role: newRole,
    };
    try {
      await updateUser({ user_id: user.id, data: updatedUser });
    } catch (err) {
      console.error(err);
      alert('Failed to update user role');
    }
  };

  const handleSaveUser = async () => {
    if (selectedUser) {
      const updatedUser: UserUpdate = {
        name,
        email,
        role,
      };
      try {
        await updateUser({ user_id: selectedUser.id, data: updatedUser });
        setOpenEditDialog(false);
      } catch (err) {
        console.error(err);
        alert('Failed to update user');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred: {error.toString()}</div>;

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditUser(user)}
                    disabled={user.role === 'root'}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteUser(user.id, user.role)}
                    disabled={user.role === 'root'}
                  >
                    <DeleteIcon />
                  </IconButton>
                  {user.role !== 'root' && (
                    <Button
                      onClick={() => handlePromoteDemote(user)}
                    >
                      {user.role === 'user' ? 'Promote to Admin' : 'Demote to User'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin' | 'root')}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="root">Root</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagement;
