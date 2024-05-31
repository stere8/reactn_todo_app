import axios from "axios";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap"; // Import Table component from Bootstrap

function TaskList({ filters, editable = false, onEdit, onDelete }) {
  const [taskList, setTaskList] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(
          "https://localhost:7035/api/Users"
        );
        const tasksResponse = await axios.get(
          "https://localhost:7035/api/Tasks"
        );

        const dataUsers = usersResponse.data.$values || [];
        const dataTasks = tasksResponse.data.$values || [];

        setUserList(Array.isArray(dataUsers) ? dataUsers : []);
        setTaskList(Array.isArray(dataTasks) ? dataTasks : []);

        // Define a single filter function combining all conditions
        const filterTasks = (tasks, filters) => {
          return tasks.filter(
            (item) =>
              (!filters.userId || item.id === filters.userId) && // Use id for task filtering
              (!filters.endDate ||
                new Date(item.dueDate) <= new Date(filters.endDate)) &&
              (!filters.startDate ||
                new Date(item.dueDate) >= new Date(filters.startDate)) &&
              (filters.completed === undefined ||
                item.completed === filters.completed)
          );
        };

        // Await for taskList to be populated before filtering
        const tasks = await taskList;
        console.log(tasks);
        console.log(filters);
        const filteredTasks = filterTasks(tasks, filters);
        console.log(filteredTasks);
        setFilteredTasks(filteredTasks);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]); // Re-run only when filters change

  useEffect(() => {
    console.log("taskList updated:", taskList);
  }, [taskList]);

  useEffect(() => {
    console.log("userList updated:", userList);
  }, [userList]);

  useEffect(() => {
    console.log("filteredTasks updated:", filteredTasks);
  }, [filteredTasks]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (
    filteredTasks.length === 0 &&
    filters.userId === "" &&
    filters.endDate === "" &&
    filters.startDate === "" &&
    filters.completed === ""
  )
    return (
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Completed</th>
            <th>User</th>
            {editable && <th>Actions</th>}
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
                {userList.find((user) => user.id === task.userId)?.username}
              </td>
              {editable && (
                <td>
                  <button onClick={() => onEdit(task)}>Edit</button>
                  <button onClick={() => onDelete(task.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Completed</th>
          <th>User</th>
          {editable && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {filteredTasks.map((task) => (
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
            {editable && (
              <td>
                <button onClick={() => onEdit(task)}>Edit</button>
                <button onClick={() => onDelete(task.id)}>Delete</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TaskList;
