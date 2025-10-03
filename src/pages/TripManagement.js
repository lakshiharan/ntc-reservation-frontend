import React, { useEffect, useState } from "react";
import axios from "../axios";

const TripManagement = () => {
    const [trips, setTrips] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [buses, setBuses] = useState([]);
    const [newTrip, setNewTrip] = useState({
        bus_id: "",
        route_id: "",
        arrival_time: "",
        departure_time: "",
        middle_stops: "",
    });
    const [editingTrip, setEditingTrip] = useState(null);

    // Fetch Trips
    const fetchTrips = async () => {
        try {
            const response = await axios.get("/trips", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTrips(response.data);
        } catch (error) {
            console.error("Error fetching trips:", error);
        }
    };

    // Fetch Routes
    const fetchRoutes = async () => {
        try {
            const response = await axios.get("/routes", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setRoutes(response.data);
        } catch (error) {
            console.error("Error fetching routes:", error);
        }
    };

    // Fetch Buses
    const fetchBuses = async () => {
        try {
            const response = await axios.get("/buses", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setBuses(response.data);
        } catch (error) {
            console.error("Error fetching buses:", error);
        }
    };

    useEffect(() => {
        fetchTrips();
        fetchRoutes();
        fetchBuses();
    }, []);

    // Handle Add Trip
    const handleAddTrip = async () => {
        try {
            console.log("Adding trip with:", newTrip);
            const response = await axios.post("/trips", newTrip, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("Trip added successfully!");
            console.log("New trip:", response.data);
            setNewTrip({
                bus_id: "",
                route_id: "",
                arrival_time: "",
                departure_time: "",
                middle_stops: "",
            });
            fetchTrips();
        } catch (error) {
            console.error("Add trip error:", error.response?.data || error.message);
            alert(error.response?.data?.error || "Failed to add trip.");
        }
    };

    // Handle Edit Trip
    const handleEditTrip = async () => {
        try {
            const response = await axios.put(`/trips/${editingTrip._id}`, editingTrip, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("Trip updated successfully!");
            setEditingTrip(null);
            fetchTrips();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to update trip.");
        }
    };

    // Handle Delete Trip
    const handleDeleteTrip = async (id) => {
        if (window.confirm("Are you sure you want to delete this trip?")) {
            try {
                await axios.delete(`/trips/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                alert("Trip deleted successfully!");
                fetchTrips();
            } catch (error) {
                alert(error.response?.data?.error || "Failed to delete trip.");
            }
        }
    };

    return (
        <div className="container">
            <h1>Trip Management</h1>

            <h2>Add New Trip</h2>
            <div>
                <label>Bus:</label>
                <select
                    value={newTrip.bus_id}
                    onChange={(e) => setNewTrip({ ...newTrip, bus_id: e.target.value })}
                >
                    <option value="">Select a Bus</option>
                    {buses.map((bus) => (
                        <option key={bus._id} value={bus._id}>
                            {bus.bus_number}
                        </option>
                    ))}
                </select>

                <label>Route:</label>
                <select
                    value={newTrip.route_id}
                    onChange={(e) => setNewTrip({ ...newTrip, route_id: e.target.value })}
                >
                    <option value="">Select a Route</option>
                    {routes.map((route) => (
                        <option key={route._id} value={route._id}>
                            {route.start_point} to {route.end_point}
                        </option>
                    ))}
                </select>

                <label>Arrival Time:</label>
                <input
                    type="datetime-local"
                    value={newTrip.arrival_time}
                    onChange={(e) => setNewTrip({ ...newTrip, arrival_time: e.target.value })}
                />

                <label>Departure Time:</label>
                <input
                    type="datetime-local"
                    value={newTrip.departure_time}
                    onChange={(e) => setNewTrip({ ...newTrip, departure_time: e.target.value })}
                />

                <label>Middle Stops:</label>
                <textarea
                    value={newTrip.middle_stops}
                    onChange={(e) => setNewTrip({ ...newTrip, middle_stops: e.target.value })}
                ></textarea>

                <button onClick={handleAddTrip}>Add Trip</button>
            </div>

            <h2>All Trips</h2>
            <table>
                <thead>
                    <tr>
                        <th>Bus</th>
                        <th>Route</th>
                        <th>Arrival Time</th>
                        <th>Departure Time</th>
                        <th>Middle Stops</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map((trip) => (
                        <tr key={trip._id}>
                            <td>{trip.bus_id?.bus_number || "N/A"}</td>
                            <td>
                                {trip.route_id
                                    ? `${trip.route_id.start_point} to ${trip.route_id.end_point}`
                                    : "N/A"}
                            </td>
                            <td>{trip.arrival_time}</td>
                            <td>{trip.departure_time}</td>
                            <td>{trip.middle_stops}</td>
                            <td>
                                <button onClick={() => setEditingTrip(trip)}>Edit</button>
                                <button onClick={() => handleDeleteTrip(trip._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingTrip && (
                <div>
                    <h2>Edit Trip</h2>
                    <label>Bus:</label>
                    <select
                        value={editingTrip.bus_id}
                        onChange={(e) =>
                            setEditingTrip({ ...editingTrip, bus_id: e.target.value })
                        }
                    >
                        <option value="">Select a Bus</option>
                        {buses.map((bus) => (
                            <option key={bus._id} value={bus._id}>
                                {bus.bus_number}
                            </option>
                        ))}
                    </select>

                    <label>Route:</label>
                    <select
                        value={editingTrip.route_id}
                        onChange={(e) =>
                            setEditingTrip({ ...editingTrip, route_id: e.target.value })
                        }
                    >
                        <option value="">Select a Route</option>
                        {routes.map((route) => (
                            <option key={route._id} value={route._id}>
                                {route.start_point} to {route.end_point}
                            </option>
                        ))}
                    </select>

                    <label>Arrival Time:</label>
                    <input
                        type="datetime-local"
                        value={editingTrip.arrival_time}
                        onChange={(e) =>
                            setEditingTrip({ ...editingTrip, arrival_time: e.target.value })
                        }
                    />

                    <label>Departure Time:</label>
                    <input
                        type="datetime-local"
                        value={editingTrip.departure_time}
                        onChange={(e) =>
                            setEditingTrip({ ...editingTrip, departure_time: e.target.value })
                        }
                    />

                    <label>Middle Stops:</label>
                    <textarea
                        value={editingTrip.middle_stops}
                        onChange={(e) =>
                            setEditingTrip({ ...editingTrip, middle_stops: e.target.value })
                        }
                    ></textarea>

                    <button onClick={handleEditTrip}>Save</button>
                    <button onClick={() => setEditingTrip(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default TripManagement;
