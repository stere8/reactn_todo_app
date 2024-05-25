import React, { useState, useEffect } from "react";


function TaskList() {
  const [taskList, setTaskList] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7149/api/Tasks");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        
        console.log('[{"id":1,"title":"Complete Project Proposal","description":"Finish drafting the project proposal document.","dueDate":"2024-05-30T00:00:00","completed":false,"userId":5,"user":null},{"id":2,"title":"Review Code Changes","description":"Review and provide feedback on recent code changes.","dueDate":null,"completed":false,"userId":6,"user":null},{"id":3,"title":"Review Code Changes","description":"Review and provide feedback on recent code changes.","dueDate":"2024-05-24T00:00:00","completed":false,"userId":6,"user":null}]');
        setTaskList(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();},[]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
          {taskList.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No Due date"}
              </td>
              <td>{task.completed ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
