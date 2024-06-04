// taskmanagment.client/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import UserList from '../components/UsersList';

function Home() {
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    setFilters({
      userId: "",
      completed: "",
      startDate: "",
      endDate: "",
    });
  }, []);

  const handleViewTasks = (userId) => {
    setFilters({
      userId: userId,
      completed: "",
      startDate: "",
      endDate: "",
    });;  };

  const handleViewAll = () => {
    setFilters({
      userId: "",
      completed: "",
      startDate: "",
      endDate: "",
    });;
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome to the Task Management App</h1>
      <button onClick={handleViewAll}>View All Tasks</button>
      <TaskList filters={filters} editable={false} />
      <UserList onViewTasks={handleViewTasks} onHomePage= {true}/>
    </div>
  );
}

export default Home;