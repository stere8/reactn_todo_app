import React from 'react';
import TaskList from '../components/TaskList';
import UserList from '../components/UsersList';

function Home() {
  return (
    <div>
      <h2>Welcome to the Task Management App</h2>
      <TaskList />
      <UserList />
    </div>
  );
}

export default Home;