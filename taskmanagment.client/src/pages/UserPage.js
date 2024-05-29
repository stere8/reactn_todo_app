import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '', repeatPassword: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://localhost:7035/api/Users");
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.repeatPassword) {
      alert("Passwords do not match!");
      return;
    }
    const userPayload = {
      username: form.username,
      email: form.email,
      password: form.password
    };
    if (selectedUser) {
      await axios.put(`https://localhost:7035/api/Users/${selectedUser.id}`, userPayload);
    } else {
      await axios.post("https://localhost:7035/api/Users/register", userPayload);
    }
    setForm({ username: '', email: '', password: '', repeatPassword: '' });
    setSelectedUser(null);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setForm({ username: user.username, email: user.email, password: '', repeatPassword: '' });
  };

  const handleDelete = async (userId) => {
    await axios.delete(`https://localhost:7035/api/Users/${userId}`);
    fetchUsers();
  };

  return (
    <div>
      <h2>Users</h2>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} ({user.email})
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleInputChange}
          placeholder="Username"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleInputChange}
          placeholder="Password"
        />
        <input
          type="password"
          name="repeatPassword"
          value={form.repeatPassword}
          onChange={handleInputChange}
          placeholder="Repeat Password"
        />
        <button type="submit">{selectedUser ? 'Update' : 'Add'} User</button>
      </form>
    </div>
  );
}

export default UsersPage;