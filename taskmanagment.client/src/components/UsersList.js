import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap"; // Import Table component from Bootstrap

const userList = [
  {
    id: 0,
    username: "unknown",
    email: "unknown@unknown",
    passwordHash: "string",
    tasks: null,
  },
];

function UserList() {
  const [userList, setUserList] = useState([]);
  const [taskList, setTaskList] = useState([]);
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
        <p>Loading users...</p>
      ) : error ? (
        <p>Error fetching users: {error}</p>
      ) : (
        <Table striped="columns">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.id}>
                <td scope="row">{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button className="btn btn-primary btn-sm">View Tasks</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default UserList;
