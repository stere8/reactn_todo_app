// taskmanagment.client/src/pages/UserPage.js
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import UserList from '../components/UsersList';
import config from "../config";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/Users`);
            console.log(response.data)
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (selectedUser) {
            await axios.put(`${config.API_URL}/Users/${selectedUser.id}`, form);
        } else {
            await axios.post(`${config.API_URL}/Users`, form);
        }
        setForm({username: '', email: '', password: '', repeatPassword: ''});
        setSelectedUser(null);
        fetchUsers();
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setForm({
            username: user.username,
            email: user.email,
            password: '',
            repeatPassword: ''
        });
    };

    const handleDelete = async (userId) => {
        await axios.delete(`${config.API_URL}/Users/${userId}`);
        fetchUsers();
    };

    return (
        <div>
            <h2>Users</h2>
            <UserList editable={true} onEdit={handleEdit} onDelete={handleDelete}/>
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