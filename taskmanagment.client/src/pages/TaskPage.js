import React, { useState } from 'react';
import TaskList from '../components/TaskList';

function TasksPage() {
  const [taskList,setTaskList]= useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ 
    userId:"",
    completed:null,
    startDate:null,
    endDate:null
  });
    
  return (
    <div>
      <h2>Tasks</h2>
      <TaskList />
    </div>
  );
}

export default TasksPage;