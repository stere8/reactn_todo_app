import React, { useState } from 'react';
import TaskList from '../components/TaskList';
import UserList from '../components/UsersList';

function Home() {
  const [filters] = useState({ userId: '', otherFilter: '' });

  return (
    <div>
      <h2>Welcome to the Task Management App</h2>
      <TaskList filters={filters} />
      <UserList />
    </div>
  );
}

export default Home;
