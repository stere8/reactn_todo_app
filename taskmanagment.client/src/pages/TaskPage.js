import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import axios from 'axios'; // Assuming you're using axios for HTTP requests

function TasksPage() {
  const [filters, setFilters] = useState({ 
    userId: "",
    completed: "",
    startDate: null,
    endDate: null
  });

  const [userList, setUserList] = useState([]);
  
  // Fetch users data from the API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersResponse = await fetch("https://localhost:7035/api/Users");
        const dataUsers = await usersResponse.json();

        setUserList(dataUsers);
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
      userId: "", // Remove user filter
      completed: "", // Reset completed filter
      startDate: null, // Reset start date
      endDate: null // Reset end date
    });
  };

  const filteredTasks = () => {
    // Assuming taskList is your tasks data array
    return filters.filter(task => {
      if (filters.userId && task.userId !== parseInt(filters.userId)) {
        return false;
      }
      if (filters.completed !== "") {
        if (filters.completed === "true" && !task.completed) {
          return false;
        }
        if (filters.completed === "false" && task.completed) {
          return false;
        }
      }
      if (filters.startDate && task.startDate < filters.startDate) {
        return false;
      }
      if (filters.endDate && task.endDate > filters.endDate) {
        return false;
      }
      return true;
    });
  };
  
  
  

  return (
    <div>
      <h2>Tasks</h2>
      <div>
        { <label>
          User ID:
          <select name="userId" value={filters.userId} onChange={handleFilterChange}>
            <option value="">All</option>
            {userList.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </label> }
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
          <input type="date" name="startDate" value={filters.startDate || ''} onChange={handleFilterChange} />
        </label>
        <label>
          End Date:
          <input type="date" name="endDate" value={filters.endDate || ''} onChange={handleFilterChange} />
        </label>
        <button onClick={handleResetFilters}>Reset Filters</button>
      </div>
      <TaskList filters={filteredTasks()} />
    </div>
  );
}

export default TasksPage;
