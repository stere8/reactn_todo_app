// taskmanagment.client/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import UserList from '../components/UsersList';

function Home() {
  const [filters, setFilters] = useState({});
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch tasks and users
  }, []);

  const handleViewTasks = (userId) => {
    setFilters({ userId });
  };

  const handleViewAll = () => {
    setFilters({});
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome to the Task Management App</h1>
      <button onClick={handleViewAll}>View All Tasks</button>
      <TaskList filters={filters} editable={false} />
      <UserList onViewTasks={handleViewTasks} editable={false} />
    </div>
  );
}

export default Home;