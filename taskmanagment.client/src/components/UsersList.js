import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import config from '../config';

function UserList({ onViewTasks, editable = false, onEdit, onDelete, onHomePage = false }) {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`${config.API_URL}/Users`);
        const dataUsers = usersResponse.data.$values || [];
        setUserList(dataUsers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p>Error fetching users: {error}</p>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="User table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                {editable && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {onHomePage && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => onViewTasks(user.id)}
                      >
                        View Tasks
                      </Button>
                    )}
                    {editable && (
                      <>
                        <Button onClick={() => onEdit(user)} variant="outlined" size="small">
                          Edit
                        </Button>
                        <Button onClick={() => onDelete(user.id)} variant="outlined" size="small">
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default UserList;
