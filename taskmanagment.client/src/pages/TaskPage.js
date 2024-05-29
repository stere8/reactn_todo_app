import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import axios from 'axios';

function TasksPage() {
  const [filters, setFilters] = useState({
    userId: "",
    completed: "",
    startDate: "",
    endDate: ""
  });

  const [userList, setUserList] = useState([]);
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersResponse = await axios.get("https://localhost:7035/api/Users");
        setUserList(usersResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    async function fetchTasks() {
      try {
        const tasksResponse = await axios.get("https://localhost:7035/api/Tasks");
        setTaskList(tasksResponse.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchUsers();
    fetchTasks();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    console.log(filters)
  };

  const handleResetFilters = () => {
    setFilters({
      userId: "",
      completed: "",
      startDate: "",
      endDate: ""
    });
  };

  const filteredTasks = taskList.filter(task => {
    if (filters.userId && task.userId !== parseInt(filters.userId)) {
      return false;
    }
    if (filters.completed !== "") {
      const isCompleted = filters.completed === "true";
      if (task.completed !== isCompleted) {
        return false;
      }
    }
    if (filters.startDate && new Date(task.startDate) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(task.endDate) > new Date(filters.endDate)) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <h2>Tasks</h2>
      <div>
        <label>
          User ID:
          <select name="userId" value={filters.userId} onChange={handleFilterChange}>
            <option value="">All</option>
            {userList.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </label>
        <label>
          Completed:
          <select name="completed" value={filters.completed} onChange={handleFilterChange}>
            <option value="">Both</option>
            <option value="true">Completed</option>
            <option value="false">Not Completed</option>
          </select>
        </label>
        <label>
          Start Date:
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
        </label>
        <label>
          End Date:
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
        </label>
        <button onClick={handleResetFilters}>Reset Filters</button>
      </div>
      <TaskList filters={filters} />
    </div>
  );
}

export default TasksPage;