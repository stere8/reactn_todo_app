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

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersResponse = await axios.get("https://localhost:7035/api/Users");
        setUserList(usersResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleResetFilters = () => {
    setFilters({
      userId: "",
      completed: "",
      startDate: "",
      endDate: ""
    });
  };

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
