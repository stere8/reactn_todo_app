import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Button, Grid } from '@mui/material';
import config from '../config';

function TaskView({ onBack }) {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseTask = await axios.get(`${config.API_URL}/Tasks/${taskId}`);
                setTask(responseTask.data);

                const responseUser = await axios.get(`${config.API_URL}/Users/${responseTask.data.userId}`);
                setUser(responseUser.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [taskId]);

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const contactUser = () => {
        if (user && user.email) {
            window.location.href = `mailto:${user.email}`;
        } else {
            alert('User email not available');
        }
    };

    const getTaskStatus = () => {
        if (!task) return '';
        if (task.completed) {
            return "Completed";
        } else if (!task.completed && new Date(task.dueDate) < new Date()) {
            return "Late";
        } else {
            return "In Progress";
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${config.API_URL}/Tasks/${taskId}`);
            alert('Task deleted successfully');
            navigate('/tasks'); // Redirect to task list
        } catch (error) {
            setError(error.message);
        }
    };

    const handleToggleComplete = async () => {
        try {
            const updatedTask = { ...task, completed: !task.completed };
            await axios.put(`${config.API_URL}/Tasks/${taskId}`, updatedTask);
            setTask(updatedTask); // Update local state
            // Optionally handle success notification or other actions
        } catch (error) {
            setError(error.message);
        }
    };

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
                        <strong>Status:</strong> <span style={{ color: task.completed ? 'green' : new Date(task.dueDate) < new Date() ? 'red' : 'orange' }}>
                            {task.completed ? "Completed" : new Date(task.dueDate) < new Date() ? 'Late' : 'In Progress'}
                        </span>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Assigned To:</strong> {user ? user.username : 'Unknown'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleBack}
                                component={Link}
                                to="/tasks"
                                style={{ marginRight: '10px' }}
                            >
                                Back to Tasks
                            </Button>
                        </Grid>
                        {user && user.email && (
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={contactUser}
                                    style={{ marginRight: '10px' }}
                                >
                                    Contact User
                                </Button>
                            </Grid>
                        )}
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleDelete}
                                style={{ marginRight: '10px' }}
                            >
                                Delete
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: task.completed ? '#bdbdbd' : '#3f51b5', color: 'white', marginRight: '10px' }}
                                onClick={handleToggleComplete}
                            >
                                {task.completed ? "Mark as Undone" : "Mark as Done"}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to={`/tasks/edit/${taskId}`}
                            >
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default TaskView;
