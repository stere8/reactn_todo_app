import React from 'react';
import { Table } from 'react-bootstrap'; // Import Table component from Bootstrap

function TaskList({ filters = {}, tasks = [], users = [], onEdit, onDelete }) {
  // Apply filters if they exist
  const filteredTasks = tasks.filter((task) => {
    const { userId, completed, startDate, endDate } = filters;
    return (
      (userId === "" || task.userId === parseInt(userId)) &&
      (completed === "" || task.completed === (completed === "true")) &&
      (!startDate || new Date(task.dueDate) >= new Date(startDate)) &&
      (!endDate || new Date(task.dueDate) <= new Date(endDate))
    );
  });

  if (!tasks.length) return <div>No tasks available</div>;

  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Completed</th>
          <th>User</th>
          {onEdit && onDelete && <th>Actions</th>} {/* Show actions if onEdit and onDelete are provided */}
        </tr>
      </thead>
      <tbody>
        {filteredTasks.length === 0 ? (
          <tr>
            <td colSpan="6">No tasks to display</td>
          </tr>
        ) : (
          filteredTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due date'}</td>
              <td>{task.completed ? 'Yes' : 'No'}</td>
              <td>{users.find((user) => user.id === task.userId)?.username}</td>
              {onEdit && onDelete && (
                <td>
                  <button onClick={() => onEdit(task)}>Edit</button>
                  <button onClick={() => onDelete(task.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default TaskList;
