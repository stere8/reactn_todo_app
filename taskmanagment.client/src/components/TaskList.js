import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import '../Styles/TaskList.css'; // Import your CSS file

function TaskList({ filters = { userId: '', completed: '', startDate: '', endDate: '' }, editable = false, onEdit, onDelete }) {
  const [taskList, setTaskList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Access navigate function from react-router-dom

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`${config.API_URL}/Users`);
        const tasksResponse = await axios.get(`${config.API_URL}/Tasks`);

        setUserList(usersResponse.data.$values || []);
        setTaskList(tasksResponse.data.$values || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const getRowClassName = (task) => {
    if (!task.completed && new Date(task.dueDate) < new Date()) {
      return "not-completed";
    } else if (task.completed) {
      return "completed";
    } else {
      return ""; // Default class or none
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleRowClick = (taskId) => {
    navigate(`/tasks/${taskId}`); // Navigate to TaskView page with taskId
  };

  return (
    <TableContainer component={Paper} className="table-container">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>User</TableCell>
            {editable && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {taskList.filter((item) => {
            return (
              (filters.completed === '' ? item : item.completed === filters.completed) &&
              (filters.userId === '' ? item : item.userId == filters.userId) &&
              (filters.startDate === '' ? item : item.dueDate >= filters.startDate) &&
              (filters.endDate === '' ? item : item.dueDate <= filters.endDate)
            );
          }).map((task) => (
            <TableRow key={task.id} className={getRowClassName(task)} onClick={() => handleRowClick(task.id)}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due date'}</TableCell>
              <TableCell>{task.completed ? 'Yes' : 'No'}</TableCell>
              <TableCell>{userList.find((user) => user.id === task.userId)?.username}</TableCell>
              {editable && (
                <TableCell className="table-cell-actions">
                  <Button onClick={() => onEdit(task)}>Edit</Button>
                  <Button onClick={() => onDelete(task.id)}>Delete</Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TaskList;
