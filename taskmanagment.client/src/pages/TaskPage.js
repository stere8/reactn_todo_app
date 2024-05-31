import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskList from "../components/TaskList";

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
      const tasksResponse = await axios.get("https://localhost:7035/api/Tasks");
      const dataUsers = tasksResponse.data.$values || [];
      setTasks(Array.isArray(dataUsers) ? dataUsers : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersResponse = await axios.get("https://localhost:7035/api/Users");
      const dataUsers = usersResponse.data.$values || [];
      setUsers(Array.isArray(dataUsers) ? dataUsers : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTask) {
        await axios.put(
          `https://localhost:7035/api/Tasks/${selectedTask.id}`,
          form
        );
      } else {
        await axios.post("https://localhost:7035/api/Tasks", form);
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
      await axios.delete(`https://localhost:7035/api/Tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    console.log('Filters', filters)
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
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleInputChange}
          placeholder="Title"
        />
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleInputChange}
        />
        <label>
          Completed:
          <input
            type="checkbox"
            name="completed"
            checked={form.completed}
            onChange={() => setForm({ ...form, completed: !form.completed })}
          />
        </label>
        <label>
          User:
          <select
            name="userId"
            value={form.userId}
            onChange={handleInputChange}
          >
            <option value="">Select User</option>
            {Array.isArray(users) &&
              users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
          </select>
        </label>
        <button type="submit">{selectedTask ? "Update" : "Add"} Task</button>
      </form>
      <button type="submit" onClick={handleFormReset}>
        {" "}
        Reset Form
      </button>
    </div>
  );
}

export default TasksPage;
