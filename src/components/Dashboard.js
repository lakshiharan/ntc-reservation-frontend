import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [buses, setBuses] = useState([]);
  const [newBus, setNewBus] = useState({
    bus_number: "",
    capacity: "",
    route_id: "",
    bus_permission_number: "",
  });
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch user-specific reservations
  const fetchReservations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/reservations/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      groupReservations(response.data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  }, []);

  // Fetch all reservations for admin
  const fetchAllReservations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      groupReservations(response.data);
    } catch (error) {
      console.error("Failed to fetch all reservations:", error);
    }
  }, []);

  // Group reservations by ticket ID
  const groupReservations = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const existing = acc.find((res) => res.ticket_id === curr.ticket_id);
      if (existing) {
        existing.seat_numbers.push(...curr.seat_numbers);
      } else {
        acc.push({
          ...curr,
          seat_numbers: [...curr.seat_numbers],
        });
      }
      return acc;
    }, []);
    setReservations(grouped);
  };

  // Fetch buses for operators
  const fetchOperatorBuses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/buses/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(response.data);
    } catch (error) {
      console.error("Failed to fetch operator buses:", error);
    }
  }, []);

  // Fetch all buses for admin
  const fetchAllBuses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/buses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(response.data);
    } catch (error) {
      console.error("Failed to fetch all buses:", error);
    }
  }, []);

  // Fetch routes for dropdown
  const fetchRoutes = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/routes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(response.data);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
    }
  }, []);

  // Handle adding a new bus
  const handleAddBus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/buses", newBus, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
      fetchOperatorBuses();
      setNewBus({
        bus_number: "",
        capacity: "",
        route_id: "",
        bus_permission_number: "",
      });
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add bus.");
    }
  };

  // Handle deleting a bus
  const handleDeleteBus = async (busId) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/buses/${busId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Bus deleted successfully!");
        fetchOperatorBuses();
      } catch (error) {
        alert(error.response?.data?.error || "Failed to delete bus.");
      }
    }
  };

  // Handle ticket cancellation
  const handleCancelTicket = async (ticketId) => {
    if (window.confirm("Are you sure you want to cancel this ticket?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/reservations/ticket/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Ticket cancelled successfully!");
        fetchReservations();
      } catch (error) {
        alert(error.response?.data?.error || "Failed to cancel ticket.");
      }
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);

        if (response.data.role === "commuter") {
          fetchReservations();
        } else if (response.data.role === "admin") {
          fetchAllReservations();
          fetchAllBuses();
        } else if (response.data.role === "operator") {
          fetchOperatorBuses();
          fetchRoutes();
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate, fetchReservations, fetchAllReservations, fetchOperatorBuses, fetchAllBuses, fetchRoutes]);


  const [editBus, setEditBus] = useState(null); // Holds the bus being edited
  const handleEditBus = (busId) => {
    const busToEdit = buses.find((bus) => bus._id === busId);
    if (busToEdit) {
      setEditBus(busToEdit);
    }
  };
  const handleUpdateBus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`/buses/${editBus._id}`, editBus, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message || "Bus updated successfully!");
      setEditBus(null); // Close the edit form
      fetchAllBuses(); // Refresh the bus list
    } catch (error) {
      console.error("Error updating bus:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to update bus.");
    }
  };




  return (
    <div className="container">
      <h1>Welcome to the Dashboard</h1>
      {user ? (
        <>
          <div className="user-info">
            <h2>User Details</h2>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
          <hr />

          {/* Commuter Section */}
          {user.role === "commuter" && (
            <div className="commuter-section">
              <h2>Your Reservations</h2>
              {reservations.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Bus Number</th>
                      <th>Seats</th>
                      <th>Total Fare</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => (
                      <tr key={res.ticket_id}>
                        <td>{res.ticket_id}</td>
                        <td>{res.bus_id?.bus_number || "N/A"}</td>
                        <td>{res.seat_numbers.join(", ")}</td>
                        <td>{res.total_fare}</td>
                        <td>{res.status}</td>
                        <td>
                          {res.status === "booked" && (
                            <button onClick={() => handleCancelTicket(res.ticket_id)}>
                              Cancel Ticket
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No reservations found.</p>
              )}
              <button onClick={() => navigate("/tripsearch")}>Book a Ticket</button>
            </div>
          )}

          {user.role === "admin" && (
            <div className="admin-section">
              <h2>Admin Actions</h2>
              <button onClick={() => navigate("/buses")}>Manage Buses</button>
              <button onClick={() => navigate("/routes")}>Manage Routes</button>
              <button onClick={() => navigate("/users")}>Manage Users</button>
              <button onClick={() => navigate("/tripmanagement")}>Manage Trips</button>

              <h2>All Reservations</h2>
              <input
                type="text"
                placeholder="Search reservations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {reservations.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>User</th>
                      <th>Bus Number</th>
                      <th>Seats</th>
                      <th>Total Fare</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations
                      .filter(
                        (res) =>
                          res.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((res) => (
                        <tr key={res.ticket_id}>
                          <td>{res.ticket_id}</td>
                          <td>
                            {res.user_id?.name || "N/A"} ({res.user_id?.email || "N/A"})
                          </td>
                          <td>{res.bus_id?.bus_number || "N/A"}</td>
                          <td>{res.seat_numbers.join(", ")}</td>
                          <td>{res.total_fare}</td>
                          <td>{res.status}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p>No reservations found.</p>
              )}
            </div>
          )}



          {/* Operator Section */}
          {user.role === "operator" && (
            <div className="operator-section">
              <h2>Manage Your Buses</h2>
              <div>
                <input
                  type="text"
                  placeholder="Bus Number"
                  value={newBus.bus_number}
                  onChange={(e) => setNewBus({ ...newBus, bus_number: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Capacity"
                  value={newBus.capacity}
                  onChange={(e) => setNewBus({ ...newBus, capacity: e.target.value })}
                />
                <select
                  value={newBus.route_id}
                  onChange={(e) => setNewBus({ ...newBus, route_id: e.target.value })}
                >
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route._id} value={route._id}>
                      {route.start_point} to {route.end_point}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Permission Number"
                  value={newBus.bus_permission_number}
                  onChange={(e) =>
                    setNewBus({ ...newBus, bus_permission_number: e.target.value })
                  }
                />
                <button onClick={handleAddBus}>Add Bus</button>
              </div>
              <h3>Your Buses</h3>
              {buses.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Bus Number</th>
                      <th>Capacity</th>
                      <th>Route</th>
                      <th>Owner</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buses.map((bus) => (
                      <tr key={bus._id}>
                        <td>{bus.bus_number}</td>
                        <td>{bus.capacity}</td>
                        <td>
                          {bus.route_id
                            ? `${bus.route_id.start_point} to ${bus.route_id.end_point}`
                            : "N/A"}
                        </td>
                        <td>
                          {bus.bus_owner
                            ? `${bus.bus_owner.name} (${bus.bus_owner.email})`
                            : "N/A"}
                        </td>
                        <td>
                          <button onClick={() => handleEditBus(bus._id)}>Edit</button>
                          <button onClick={() => handleDeleteBus(bus._id)}>Delete</button>
                          <button onClick={() => handleUpdateBus(bus._id)}>Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No buses found.</p>
              )}
            </div>
          )}

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );

};

export default Dashboard;
