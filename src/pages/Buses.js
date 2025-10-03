import React, { useState, useEffect } from "react";
import axios from "../axios";

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [busDetails, setBusDetails] = useState({
    bus_number: "",
    capacity: "",
    route_id: "",
    bus_owner: "",
    bus_permission_number: "",
  });
  const [editingBus, setEditingBus] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State to store search input

  useEffect(() => {
    fetchBuses();
    fetchRoutes();
  }, []);

  const fetchBuses = async () => {
    const res = await axios.get("/buses", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setBuses(res.data);
  };

  const fetchRoutes = async () => {
    const res = await axios.get("/routes", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setRoutes(res.data);
  };

  const handleInputChange = (e) => {
    setBusDetails({ ...busDetails, [e.target.name]: e.target.value });
  };

  const handleRouteChange = (e) => {
    setBusDetails({ ...busDetails, route_id: e.target.value });
  };

  const handleAddBus = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.post("/buses", busDetails, { headers });
      alert("Bus added successfully!");
      fetchBuses();
      setBusDetails({
        bus_number: "",
        capacity: "",
        route_id: "",
        bus_owner: "",
        bus_permission_number: "",
      });
    } catch (error) {
      console.error("Error adding bus:", error);
      alert(error.response?.data?.error || "Failed to add bus.");
    }
  };

  const handleDeleteBus = async (id) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      try {
        await axios.delete(`/buses/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Bus deleted successfully!");
        fetchBuses();
      } catch (error) {
        alert(error.response?.data?.error || "Failed to delete bus.");
      }
    }
  };

  const handleEditBus = (bus) => {
    setEditingBus(bus);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedBus = {
        bus_number: editingBus.bus_number,
        capacity: editingBus.capacity,
        route_id: editingBus.route_id,
        bus_owner: editingBus.bus_owner,
      };

      await axios.put(`/buses/${editingBus._id}`, updatedBus, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("Bus updated successfully!");
      fetchBuses();
      setEditingBus(null);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update bus.");
    }
  };

  // Filter buses based on the search term
  const filteredBuses = buses.filter(
    (bus) =>
      bus.bus_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.bus_owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.bus_permission_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Bus Management</h1>
      <div>
        <input
          type="text"
          placeholder="Search by Bus Number, Owner, or Permission Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
        />
      </div>
      {editingBus ? (
        <div>
          <h3>Edit Bus</h3>
          <form>
            <label>Bus Number:</label>
            <input
              type="text"
              value={editingBus.bus_number}
              onChange={(e) =>
                setEditingBus({ ...editingBus, bus_number: e.target.value })
              }
            />
            <label>Capacity:</label>
            <input
              type="number"
              value={editingBus.capacity}
              onChange={(e) =>
                setEditingBus({ ...editingBus, capacity: e.target.value })
              }
            />
            <label>Route:</label>
            <select
              value={editingBus.route_id}
              onChange={(e) =>
                setEditingBus({ ...editingBus, route_id: e.target.value })
              }
            >
              <option value="">Select a Route</option>
              {routes.map((route) => (
                <option key={route._id} value={route._id}>
                  {route.start_point} - {route.end_point}
                </option>
              ))}
            </select>
            <label>Bus Owner:</label>
            <input
              type="text"
              value={editingBus.bus_owner}
              onChange={(e) =>
                setEditingBus({ ...editingBus, bus_owner: e.target.value })
              }
            />
            <button type="button" onClick={handleSaveEdit}>
              Save
            </button>
            <button type="button" onClick={() => setEditingBus(null)}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div>
            <h3>Add Bus</h3>
            <input
              type="text"
              name="bus_number"
              value={busDetails.bus_number}
              onChange={handleInputChange}
              placeholder="Bus Number"
            />
            <input
              type="number"
              name="capacity"
              value={busDetails.capacity}
              onChange={handleInputChange}
              placeholder="Capacity"
            />
            <input
              type="text"
              name="bus_owner"
              value={busDetails.bus_owner}
              onChange={handleInputChange}
              placeholder="Bus Owner"
            />
            <input
              type="text"
              name="bus_permission_number"
              value={busDetails.bus_permission_number}
              onChange={handleInputChange}
              placeholder="Permission Number"
            />
            <select
              name="route_id"
              value={busDetails.route_id}
              onChange={handleRouteChange}
            >
              <option value="">Select a Route</option>
              {routes.map((route) => (
                <option key={route._id} value={route._id}>
                  {route.start_point} - {route.end_point}
                </option>
              ))}
            </select>
            <button onClick={handleAddBus}>Add Bus</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Bus Number</th>
                <th>Capacity</th>
                <th>Route</th>
                <th>Owner</th>
                <th>Permission Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.map((bus) => (
                <tr key={bus._id}>
                  <td>{bus.bus_number}</td>
                  <td>{bus.capacity}</td>
                  <td>
                    {bus.route_id
                      ? `${bus.route_id.start_point} - ${bus.route_id.end_point}`
                      : "No Route Assigned"}
                  </td>
                  <td>
                    {bus.bus_owner?.name || "N/A"} (
                    {bus.bus_owner?.email || "N/A"})
                  </td>
                  <td>{bus.bus_permission_number}</td>
                  <td>
                    <button onClick={() => handleEditBus(bus)}>Edit</button>
                    <button onClick={() => handleDeleteBus(bus._id)}>
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

export default BusManagement;
