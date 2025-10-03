import React, { useState, useEffect } from "react";
import axios from "../axios";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("/users", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            alert("Failed to fetch users.");
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
    };
    const handleSaveEdit = async () => {
        try {
            const updatedUser = {
                name: editingUser.name,
                email: editingUser.email, // Include email
                role: editingUser.role,
                phone_number: editingUser.phone_number,
            };

            // Send the PUT request
            await axios.put(`/users/${editingUser._id}`, updatedUser, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            alert("User updated successfully!");
            fetchUsers(); // Refresh user list
            setEditingUser(null); // Exit editing mode
        } catch (error) {
            console.error("Error updating user:", error);
            alert(error.response?.data?.error || "Failed to update user.");
        }
    };


    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`/users/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                alert("User deleted successfully!");
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
                alert(error.response?.data?.error || "Failed to delete user.");
            }
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>User Management</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search by name, email, or role"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
                />
            </div>
            {editingUser ? (
                <div>
                    <h3>Edit User</h3>
                    <form>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={editingUser.name}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, name: e.target.value })
                            }
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            value={editingUser.email}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, email: e.target.value })
                            }
                        />

                        <label>Role:</label>
                        <select
                            value={editingUser.role}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, role: e.target.value })
                            }
                        >
                            <option value="commuter">Commuter</option>
                            <option value="admin">Admin</option>
                            <option value="operator">Operator</option>
                        </select>
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            value={editingUser.phone_number}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, phone_number: e.target.value })
                            }
                        />
                        <button type="button" onClick={handleSaveEdit}>
                            Save
                        </button>
                        <button type="button" onClick={() => setEditingUser(null)}>
                            Cancel
                        </button>
                    </form>
                </div>
            ) : (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Phone Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.phone_number}</td>
                                    <td>
                                        <button onClick={() => handleEditUser(user)}>Edit</button>
                                        <button onClick={() => handleDeleteUser(user._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
