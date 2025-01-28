import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import './App.css'; // Import your CSS file for custom styles

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState(""); // State for due date
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    // Edit
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editDueDate, setEditDueDate] = useState(""); // State for editing due date

    const apiUrl = "http://localhost:5000"; // Change the API URL as needed

    // Handle form submission for adding a new task
    const handleSubmit = () => {
        setError("");
        if (title.trim() !== "" && description.trim() !== "" && dueDate.trim() !== "") {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description, dueDate }),
            })
                .then((res) => {
                    if (res.ok) {
                        // Add item to list
                        return res.json();
                    } else {
                        setError("Unable to create task.");
                    }
                })
                .then((data) => {
                    setTodos([...todos, data]); // Add the new task to the list
                    setTitle("");
                    setDescription("");
                    setDueDate("");
                    setMessage("Task added successfully!");
                    setTimeout(() => setMessage(""), 3000);
                })
                .catch(() => setError("Unable to create task."));
        } else {
            setError("Please fill out all fields.");
        }
    };

    // Fetch tasks when component mounts
    useEffect(() => {
        getItems();
    }, []);

    // Get all tasks from the backend
    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => setTodos(res))
            .catch(() => setError("Unable to fetch tasks."));
    };

    {todos.map((item) => (
        <li className="list-group-item" key={item._id}>
          {/* Display task details */}
          <small className="text-muted">Due: {new Date(item.dueDate).toLocaleDateString()}</small>
        </li>
      ))}
      

    // Handle edit task
    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
        setEditDueDate(item.dueDate);
    };

    // Update the edited task
    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== "" && editDescription.trim() !== "" && editDueDate.trim() !== "") {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: editTitle, description: editDescription, dueDate: editDueDate }),
            })
                .then((res) => {
                    if (res.ok) {
                        const updatedTodos = todos.map((item) => {
                            if (item._id === editId) {
                                return { ...item, title: editTitle, description: editDescription, dueDate: editDueDate };
                            }
                            return item;
                        });
                        setTodos(updatedTodos);
                        setMessage("Task updated successfully!");
                        setTimeout(() => setMessage(""), 3000);
                        setEditId(-1);
                        setEditTitle("");
                        setEditDescription("");
                        setEditDueDate("");
                    } else {
                        setError("Unable to update task.");
                    }
                })
                .catch(() => setError("Unable to update task."));
        } else {
            setError("Please fill out all fields.");
        }
    };

    // Cancel editing
    const handleEditCancel = () => {
        setEditId(-1);
        setEditTitle("");
        setEditDescription("");
        setEditDueDate("");
    };

    // Delete a task
    const handleDelete = (id) => {
        if (id && window.confirm("Are you sure you want to delete this task?")) {
            fetch(apiUrl + "/todos/" + id, {
                method: "DELETE",
            }).then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos);
                setMessage("Task deleted successfully!");
                setTimeout(() => setMessage(""), 3000);
            });
        } else {
            setError("Invalid task ID.");
        }
    };

    return (
        <>
            <div className="header p-4 text-light bg-primary">
                <h1 className="text-center bold-text">Task Management Tool</h1>
            </div>
            <div className="container mt-4">
                <h3 className="bold-text">Add New Task</h3>
                {message && <p className="text-success fw-bold">{message}</p>}
                {error && <p className="text-danger fw-bold">{error}</p>}
                <div className="form-group d-flex gap-3">
                    <input
                        placeholder="Task Title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="form-control"
                        type="text"
                    />
                    <input
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="form-control"
                        type="text"
                    />
                    <input
                        placeholder="Due Date"
                        onChange={(e) => setDueDate(e.target.value)}
                        value={dueDate}
                        className="form-control"
                        type="date"
                    />
                    <button className="btn btn-success" onClick={handleSubmit}>
                        Add Task
                    </button>
                </div>
            </div>
            <div className="container mt-5">
                <h3 className="bold-text">Task List</h3>
                <ul className="list-group">
                    {todos.map((item) => (
                        <li className="list-group-item task-item my-2 p-3 d-flex justify-content-between align-items-center" key={item._id}>
                            <div className="task-details">
                                {editId === -1 || editId !== item._id ? (
                                    <>
                                        <h5 className="mb-1 text-primary fw-bold">{item.title}</h5>
                                        <p className="mb-1">{item.description}</p>
                                        <small className="text-muted">Due: {new Date(item.dueDate).toLocaleDateString()}</small>
                                    </>
                                ) : (
                                    <div className="form-group d-flex gap-2">
                                        <input
                                            placeholder="Title"
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            value={editTitle}
                                            className="form-control"
                                            type="text"
                                        />
                                        <input
                                            placeholder="Description"
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            value={editDescription}
                                            className="form-control"
                                            type="text"
                                        />
                                        <input
                                            placeholder="Due Date"
                                            onChange={(e) => setEditDueDate(e.target.value)}
                                            value={editDueDate}
                                            className="form-control"
                                            type="date"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="task-actions d-flex gap-2">
                                {editId === -1 ? (
                                    <button className="btn btn-warning" onClick={() => handleEdit(item)}>
                                        <FaEdit />
                                    </button>
                                ) : (
                                    <button className="btn btn-success" onClick={handleUpdate}>
                                        <FaCheck />
                                    </button>
                                )}
                                {editId === -1 ? (
                                    <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
                                        <FaTrash />
                                    </button>
                                ) : (
                                    <button className="btn btn-secondary" onClick={handleEditCancel}>
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
