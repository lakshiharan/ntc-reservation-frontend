import React, { useState, useEffect } from "react";
import axios from "../axios";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [routeDetails, setRouteDetails] = useState({
    start_point: "",
    end_point: "",
    distance: "",
    fare: "",
  });
  const [editingRoute, setEditingRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // For filtering routes

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await axios.get("/routes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRoutes(res.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
      alert("Failed to fetch routes.");
    }
  };

  const handleInputChange = (e) => {
    setRouteDetails({ ...routeDetails, [e.target.name]: e.target.value });
  };

  const handleAddRoute = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.post("/routes", routeDetails, { headers });
      alert("Route added successfully!");
      fetchRoutes();
      setRouteDetails({ start_point: "", end_point: "", distance: "", fare: "" });
    } catch (error) {
      console.error("Error adding route:", error);
      alert(error.response?.data?.error || "Failed to add route.");
    }
  };

  const handleDeleteRoute = async (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await axios.delete(`/routes/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Route deleted successfully!");
        fetchRoutes();
      } catch (error) {
        alert(error.response?.data?.error || "Failed to delete route.");
      }
    }
  };

  const handleEditRoute = (route) => {
    setEditingRoute(route);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedRoute = {
        start_point: editingRoute.start_point,
        end_point: editingRoute.end_point,
        distance: editingRoute.distance,
        fare: editingRoute.fare,
      };

      await axios.put(`/routes/${editingRoute._id}`, updatedRoute, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("Route updated successfully!");
      fetchRoutes();
      setEditingRoute(null); // Exit editing mode
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update route.");
    }
  };

  const filteredRoutes = routes.filter(
    (route) =>
      route.start_point.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.end_point.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Route Management</h1>
      <div>
        <input
          type="text"
          placeholder="Search by Start or End Point"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
        />
      </div>
      {editingRoute ? (
        <div>
          <h3>Edit Route</h3>
          <form>
            <label>Start Point:</label>
            <input
              type="text"
              value={editingRoute.start_point}
              onChange={(e) =>
                setEditingRoute({ ...editingRoute, start_point: e.target.value })
              }
            />
            <label>End Point:</label>
            <input
              type="text"
              value={editingRoute.end_point}
              onChange={(e) =>
                setEditingRoute({ ...editingRoute, end_point: e.target.value })
              }
            />
            <label>Distance:</label>
            <input
              type="number"
              value={editingRoute.distance}
              onChange={(e) =>
                setEditingRoute({ ...editingRoute, distance: e.target.value })
              }
            />
            <label>Fare:</label>
            <input
              type="number"
              value={editingRoute.fare}
              onChange={(e) =>
                setEditingRoute({ ...editingRoute, fare: e.target.value })
              }
            />
            <button type="button" onClick={handleSaveEdit}>
              Save
            </button>
            <button type="button" onClick={() => setEditingRoute(null)}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div>
            <h3>Add Route</h3>
            <input
              type="text"
              name="start_point"
              value={routeDetails.start_point}
              onChange={handleInputChange}
              placeholder="Start Point"
            />
            <input
              type="text"
              name="end_point"
              value={routeDetails.end_point}
              onChange={handleInputChange}
              placeholder="End Point"
            />
            <input
              type="number"
              name="distance"
              value={routeDetails.distance}
              onChange={handleInputChange}
              placeholder="Distance"
            />
            <input
              type="number"
              name="fare"
              value={routeDetails.fare}
              onChange={handleInputChange}
              placeholder="Fare"
            />
            <button onClick={handleAddRoute}>Add Route</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Start Point</th>
                <th>End Point</th>
                <th>Distance</th>
                <th>Fare</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => (
                <tr key={route._id}>
                  <td>{route.start_point}</td>
                  <td>{route.end_point}</td>
                  <td>{route.distance}</td>
                  <td>{route.fare}</td>
                  <td>
                    <button onClick={() => handleEditRoute(route)}>Edit</button>
                    <button onClick={() => handleDeleteRoute(route._id)}>
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

export default RouteManagement;
