import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        setTasks(data);
        setLoading(false);
    };

    const addTask = async (task) => {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
    };

    const deleteTask = async (id) => {
        await fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
        });
        setTasks(tasks.filter(task => task.id !== id));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Task Management</h1>
            <TaskList tasks={tasks} deleteTask={deleteTask} />
            <TaskForm addTask={addTask} />
        </div>
    );
}

function TaskList({ tasks, deleteTask }) {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Completed</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                    <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>{task.dueDate}</td>
                        <td>{task.completed ? 'Yes' : 'No'}</td>
                        <td>
                            <button onClick={() => deleteTask(task.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function TaskForm({ addTask }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [completed, setCompleted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask({ title, description, dueDate, completed });
        setTitle('');
        setDescription('');
        setDueDate('');
        setCompleted(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label>Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <label>Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div>
                <label>Completed</label>
                <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
            </div>
            <button type="submit">Add Task</button>
        </form>
    );
}

export default App;