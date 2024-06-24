import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Button, Grid } from '@mui/material'; // Adjust imports as needed
import config from '../config';

function Task() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/Tasks/${taskId}`);
        setTask(response.data); // Assuming response.data contains the task object
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  if (loading) return <p>Loading task...</p>;
  if (error) return <p>Error fetching task: {error}</p>;

  if (!task) return <p>Task not found.</p>;

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8}>
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Task Details
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Title:</strong> {task.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Description:</strong> {task.description}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Status:</strong> {task.status}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Assigned To:</strong> {task.assignedTo}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleBack()}>
            Back to Tasks
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Task;
