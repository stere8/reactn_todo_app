// taskmanagment.client/src/components/UsersList.js
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap"; // Import Table component from Bootstrap

function UserList({ onViewTasks, editable = false, onEdit, onDelete, onHomePage = false }) {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(
          "https://localhost:7035/api/Users"
        );     
        const dataUsers = usersResponse.data.$values || [];
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
              {editable && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.id}>
                <td scope="row">{user.username}</td>
                <td>{user.email}</td>
                <td>
                  
                  {onHomePage && <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onViewTasks(user.id)}
                  >
                    View Tasks
                  </button>}
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