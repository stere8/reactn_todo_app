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
        console.log("dataTasks:", dataTasks);
        console.log("dataUsers:", dataUsers);

        setUserList(Array.isArray(dataUsers) ? dataUsers : []);
        setTaskList(Array.isArray(dataTasks) ? dataTasks : []);

        const filterByUserId = (userId) => (item) =>
          !userId || item.userId === userId;
        const filterByEndDate = (endDate) => (item) =>
          !endDate || new Date(item.dueDate) <= new Date(endDate);
        const filterByStartDate = (startDate) => (item) =>
          !startDate || new Date(item.dueDate) >= new Date(startDate);
        const filterByCompleted = (completed) => (item) =>
          completed === undefined || item.completed === completed;

        let filteredTasks = await taskList;

        console.log('filteredTasks in the begining',filteredTasks)
        
        if (filters.userId !== "") {
          filteredTasks = filteredTasks.filter(filterByUserId(filters.userId));
          console.log(`filteredTasks after ID ${filters.userId} : ${filteredTasks}`);
        } else {
          console.log("Pass userId");
        }
        if (filters.endDate !== "") {
          filteredTasks = filteredTasks.filter(
            filterByEndDate(filters.endDate)
          );
          console.log(`filteredTasks after ID ${filters.endDate} : ${filteredTasks}`);
        } else {
          console.log("Pass endDate");
        }
        if (filters.startDate !== "") {
          filteredTasks = filteredTasks.filter(
            filterByStartDate(filters.startDate)
          );
          console.log(`filteredTasks after ID ${filters.startDate} : ${filteredTasks}`);
        } else {
          console.log("Pass startDate");
        }
        if (filters.completed !== "") {
          filteredTasks = filteredTasks.filter(
            filterByCompleted(filters.completed)
          );
          console.log(`filteredTasks after ID ${filters.completed} : ${filteredTasks}`);
        } else {
          console.log("Pass completed");
        }

        console.log("taskList", taskList);
        console.log("filters", filters);
        console.log("filteredTasks", filteredTasks);

        setFilteredTasks(filteredTasks);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

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

  if (filteredTasks.length === 0 )
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
