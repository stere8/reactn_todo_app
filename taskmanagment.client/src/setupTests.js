// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from "react";

<form onSubmit={handleFormSubmit}>
    <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleInputChange}
        placeholder="Title"
    />
    <input
        type="text"
        name="description"
        value={form.description}
        onChange={handleInputChange}
        placeholder="Description"
    />
    <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleInputChange}
    />
    <label>
        Completed:
        <input
            type="checkbox"
            name="completed"
            checked={form.completed}
            onChange={() => setForm({...form, completed: !form.completed})}
        />
    </label>
    <label>
        User:
        <select
            name="userId"
            value={form.userId}
            onChange={handleInputChange}
        >
            <option value="">Select User</option>
            {Array.isArray(users) &&
                users.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.username}
                    </option>
                ))}
        </select>
    </label>
    <button type="submit">{selectedTask ? "Update" : "Add"} Task</button>
</form>