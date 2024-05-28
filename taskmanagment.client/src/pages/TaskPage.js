import React, { useState } from 'react';
import TaskList from '../components/TaskList';

function TasksPage() {
  const [filters, setFilters] = useState({ 
    userId: "",
    completed: null,
    startDate: null,
    endDate: null
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  return (
    <div>
      <h2>Tasks</h2>
      <div>
        <label>
          User ID:
          <input type="text" name="userId" value={filters.userId} onChange={handleFilterChange} />
        </label>
        <label>
          Completed:
          <select name="completed" value={filters.completed} onChange={handleFilterChange}>
            <option value="">All</option>
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
      </div>
      <TaskList filters={filters} />
    </div>
  );
}

export default TasksPage;