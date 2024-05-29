import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import UserList from '../components/UsersList';

function Home() {
  const [filters, setFilters] = useState({ userId: '', otherFilter: '' });
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch("https://localhost:7035/api/Users");
        const tasksResponse = await fetch("https://localhost:7035/api/Tasks");
        if (!usersResponse.ok) {
          throw new Error(`HTTP error! status: ${usersResponse.status}`);
        }
        if (!tasksResponse.ok) {
          throw new Error(`HTTP error! status: ${tasksResponse.status}`);
        }
        const dataUsers = await usersResponse.json();
        const dataTasks = await tasksResponse.json();
        setUsers(dataUsers);
        setTasks(dataTasks);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewTasks = (userId) => {
    setFilters({ ...filters, userId });
  };

  const handleViewAll = () => {
    setFilters({ userId: '', otherFilter: '' });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Welcome to the Task Management App</h2>
      <button onClick={handleViewAll}>View All Tasks</button>
      <TaskList filters={filters} tasks={tasks} users={users} />
      <UserList onViewTasks={handleViewTasks} />
    </div>
  );
}

export default Home;
