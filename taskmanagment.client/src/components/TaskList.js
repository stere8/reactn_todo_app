import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap'; // Import Table component from Bootstrap

function TaskList(filters) {
  const [taskList, setTaskList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetch("https://localhost:7035/api/Users");
        const tasks = await fetch("https://localhost:7035/api/Tasks");
        if (!users.ok) {
          throw new Error(`HTTP error! status: ${users.status}`);
        }
        if (!tasks.ok) {
          throw new Error(`HTTP error! status: ${tasks.status}`);
        }
        const dataUsers = await users.json();
        const dataTasks = await tasks.json();
        setUserList(dataUsers);
        setTaskList(dataTasks);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p>Error fetching tasks: {error}</p>
      ) : (
        <Table striped bordered hover variant="dark">
        <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Completed</th>
              <th>User</th>
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
                <td>
                  {userList.find((user) => user.id === task.userId).username}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default TaskList;
