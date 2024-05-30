// taskmanagment.client/src/components/UsersList.js
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap"; // Import Table component from Bootstrap

function UserList({ onViewTasks, editable = false, onEdit, onDelete }) {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetch("https://localhost:7035/api/Users");
        if (!users.ok) {
          throw new Error(`HTTP error! status: ${users.status}`);
        }
        const dataUsers = await users.json();
        setUserList(dataUsers);
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
          <thead className="thead-dark">
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
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onViewTasks(user.id)}
                  >
                    View Tasks
                  </button>
                  {editable && (
                    <>
                      <button onClick={() => onEdit(user)}>Edit</button>
                      <button onClick={() => onDelete(user.id)}>Delete</button>
                    </>
                  )}
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