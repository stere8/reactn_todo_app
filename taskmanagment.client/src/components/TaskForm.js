import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate  } from 'react-router-dom';
import { TextField, Button, Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import config from '../config';

const initialState = {
    title: '',
    description: '',
    dueDate: '',
    userId: '',
    completed: false, // Include completed field in the initial state
};

function TaskForm({ onSuccess }) {
    const { taskId } = useParams(); // Get taskId from URL params
    const [formData, setFormData] = useState(initialState);
    let navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/Users`);
                setUsers(response.data.$values); // Assuming the response.data contains an array of user objects
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchTask = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/Tasks/${taskId}`);
                setFormData(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
        if (taskId) {
            fetchTask();
        } else {
            setFormData(initialState); // Reset form data if no taskId (add mode)
        }
    }, [taskId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (taskId) {
                // Editing existing task
                await axios.put(`${config.API_URL}/Tasks/${taskId}`, formData);
            } else {
                // Adding new task
                await axios.post(`${config.API_URL}/Tasks`, formData);
            }
            setSuccess(true);
            if (onSuccess) {
                navigate('/tasks')
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                        {taskId ? 'Edit Task' : 'Add Task'}
                    </Typography>
                    {formData.completed && (
                        <Typography variant="body1" style={{ marginBottom: '10px', color: 'red' }}>
                            Task is completed. Editing is not allowed.
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            required
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            margin="normal"
                            disabled={formData.completed} // Disable if task is completed
                        />
                        <TextField
                            fullWidth
                            required
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            margin="normal"
                            disabled={formData.completed} // Disable if task is completed
                        />
                        <TextField
                            fullWidth
                            label="Due Date"
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={formData.completed} // Disable if task is completed
                        />
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="user-label">User</InputLabel>
                            <Select
                                labelId="user-label"
                                id="user-select"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                disabled={formData.completed} // Disable if task is completed
                            >
                                {users.map(user => (
                                    <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading || formData.completed} // Disable if loading or task is completed
                            style={{ marginTop: '20px' }}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </form>
                    {error && <Typography color="error" style={{ marginTop: '10px' }}>Error: {error}</Typography>}
                    {success && <Typography style={{ marginTop: '10px', color: 'green' }}>Task {taskId ? 'updated' : 'added'} successfully!</Typography>}
                </Paper>
            </Grid>
        </Grid>
    );
}

export default TaskForm;
