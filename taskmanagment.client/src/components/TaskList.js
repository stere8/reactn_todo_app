import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap"; // Import Table component from Bootstrap

function TaskList({ filters = {} }) {
  const [taskList, setTaskList] = useState([]);
  const [userList, setUserList] = useState([]);
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

  useEffect(() => {
    console.log('Filters changed:', filters);
  }, [filters]);

  const filteredTasks = taskList.filter((task) => {
    const { userId, completed, startDate, endDate } = filters;
    return (
      (userId === "" || task.userId === parseInt(userId)) &&
      (completed === "" || task.completed === (completed === "true")) &&
      (!startDate || new Date(task.dueDate) >= new Date(startDate)) &&
      (!endDate || new Date(task.dueDate) <= new Date(endDate))
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
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
        {filteredTasks.length === 0 ? (
          <tr>
            <td colSpan="5">No tasks to display</td>
          </tr>
        ) : (
          filteredTasks.map((task) => (
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
                {userList.find((user) => user.id === task.userId)?.username}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default TaskList;
