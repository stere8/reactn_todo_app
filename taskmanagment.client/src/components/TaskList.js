import axios from "axios";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap"; // Import Table component from Bootstrap

function TaskList({ filters = {userId: "",completed: "",startDate: "",endDate: "",}, editable = false, onEdit, onDelete }) {
  const [taskList, setTaskList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!filters){
      console.log('filters nie ma')
    }
    
    if(filters.completed){
      if (filters.completed === 'true'){
        filters.completed = true
      }
      if (filters.completed === 'false'){
        filters.completed = false
      }
    }

    console.log(filters)

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
            {editable && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {taskList.filter((item) => {
            return (filters.completed === '' ? item : item.completed === filters.completed)
                  &&(filters.userId  === '' ? item : item.userId  == filters.userId )
                  &&(filters.startDate === '' ? item : item.dueDate >= filters.startDate)  
                  &&(filters.endDate === '' ? item : item.dueDate <= filters.startDate) // Start Date filter

          }).map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No Due date"}
              </td>
              <td>{task.completed ? "Yes": "No" }</td>
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
