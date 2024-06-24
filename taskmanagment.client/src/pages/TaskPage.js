import React, {useState, useEffect} from "react";
import axios from "axios";
import TaskList from "../components/TaskList";
import config from "../config";
import {Button} from "@mui/material";
import {Link} from "react-router-dom";

function TasksPage() {
    const [filters, setFilters] = useState({
        userId: "",
        completed: "",
        startDate: "",
        endDate: "",
    });

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split("T")[0],
        completed: false,
        userId: "",
    });

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        try {
            const tasksResponse = await axios.get();
            const dataUsers = tasksResponse.data.$values || [];
            setTasks(Array.isArray(dataUsers) ? dataUsers : []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const usersResponse = await axios.get(`${config.API_URL}/Users`);
            const dataUsers = usersResponse.data.$values || [];
            setUsers(Array.isArray(dataUsers) ? dataUsers : []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedTask) {
                console.log(form)
                await axios.put(
                    `${config.API_URL}/Tasks/${selectedTask.id}`,
                    form
                );
            } else {
                await axios.post(`${config.API_URL}/Tasks`, form);
            }
            setForm({
                title: "",
                description: "",
                dueDate: new Date().toISOString().split("T")[0],
                completed: false,
                userId: "",
            });
            setSelectedTask(null);
            fetchTasks();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setForm({
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate
                ? new Date(task.dueDate).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            completed: task.completed,
            userId: task.userId,
        });
    };

    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`${config.API_URL}/Tasks/${taskId}`);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleFilterChange = (e) => {
        const {name, value} = e.target;
        setFilters({...filters, [name]: value});
        console.log("Filters", filters);
    };

    const handleResetFilters = () => {
        setFilters({
            userId: "",
            completed: "",
            startDate: "",
            endDate: "",
        });
    };

    const handleFormReset = () => {
        setForm({
            title: "",
            description: "",
            dueDate: new Date().toISOString().split("T")[0],
            completed: false,
            userId: "",
        });
        setSelectedTask("");
    };

    return (
        <div>
            <h2>Tasks</h2>
            <div>
                <label>
                    User ID:
                    <select
                        name="userId"
                        value={filters.userId}
                        onChange={handleFilterChange}
                    >
                        <option value="">All</option>
                        {Array.isArray(users) &&
                            users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                    </select>
                </label>
                <label>
                    Completed:
                    <select
                        name="completed"
                        value={filters.completed}
                        onChange={handleFilterChange}
                    >
                        <option value="">Both</option>
                        <option value="true">Completed</option>
                        <option value="false">Not Completed</option>
                    </select>
                </label>
                <label>
                    Start Date:
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                    />
                </label>
                <button onClick={handleResetFilters}>Reset Filters</button>
            </div>

            <TaskList
                filters={filters}
                editable={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/tasks/add"
            >
                Add Task
            </Button>
        </div>
    );
}

export default TasksPage;
