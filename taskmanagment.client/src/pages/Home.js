import React, { useState } from 'react';
import TaskList from '../components/TaskList';
import UserList from '../components/UsersList';

function Home() {
  const [filters, setFilters] = useState({ userId: '', otherFilter: '' });

  const handleViewTasks = (userId) => {
    setFilters({ ...filters, userId });
  };

  const handleViewAll = () => {
    setFilters({ userId: '', otherFilter: '' });
  };

  return (
    <div>
      <h2>Welcome to the Task Management App</h2>
      <button onClick={handleViewAll}>View All Tasks</button>
      <TaskList filters={filters} />
      <UserList onViewTasks={handleViewTasks} />
    </div>
  );
}

export default Home;