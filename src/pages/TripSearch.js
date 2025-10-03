import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const TripSearch = () => {
    const [startPoint, setStartPoint] = useState("");
    const [endPoint, setEndPoint] = useState("");
    const [date, setDate] = useState("");
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [routes, setRoutes] = useState([]); 
    const navigate = useNavigate();

    // Fetch available routes for dropdowns
    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await axios.get("/routes");
                setRoutes(response.data);
            } catch (error) {
                console.error("Failed to fetch routes:", error);
                alert("Error fetching route data.");
            }
        };
        fetchRoutes();
    }, []);

    // Handle trip search
    const handleSearch = async () => {
        if (!startPoint || !endPoint || !date) {
            alert("Please fill in all search fields.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You are not logged in. Please log in and try again.");
                navigate("/login");
                return;
            }

            const response = await axios.get("/trips/search", {
                params: { start_point: startPoint, end_point: endPoint, date },
                headers: { Authorization: `Bearer ${token}` },
            });

            setTrips(response.data);
        } catch (error) {
            console.error("Search error:", error.response?.data || error.message);
            if (error.response?.status === 500) {
                alert("Server error while fetching trips. Please contact support.");
            } else if (error.response?.status === 404) {
                alert("No trips found for the selected criteria.");
            } else if (error.response?.status === 401) {
                alert("Unauthorized. Please log in.");
            } else {
                alert("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <div>
            <h1>Search for Trips</h1>

            <div>
                <label>Start Point:</label>
                <select
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                >
                    <option value="">Select Start Point</option>
                    {routes.map((route) => (
                        <option key={route._id} value={route.start_point}>
                            {route.start_point}
                        </option>
                    ))}
                </select>

                <label>End Point:</label>
                <select
                    value={endPoint}
                    onChange={(e) => setEndPoint(e.target.value)}
                >
                    <option value="">Select End Point</option>
                    {routes.map((route) => (
                        <option key={route._id} value={route.end_point}>
                            {route.end_point}
                        </option>
                    ))}
                </select>

                <label>Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <button onClick={handleSearch} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            <div>
                <h2>Available Trips</h2>
                {trips.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                        {trips.map((trip) => (
                            <div
                                key={trip._id}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "20px",
                                    borderRadius: "10px",
                                    width: "300px",
                                    background: "#f9f9f9",
                                }}
                            >
                                <h3>Bus: {trip.bus_id?.bus_number || "N/A"}</h3>
                                <p>
                                    <strong>Route:</strong> {trip.route_id?.start_point} to {" "}
                                    {trip.route_id?.end_point}
                                </p>
                                <p>
                                    <strong>Departure:</strong> {" "}
                                    {new Date(trip.departure_time).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Arrival:</strong> {" "}
                                    {new Date(trip.arrival_time).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Middle Stops:</strong> {trip.middle_stops || "None"}
                                </p>
                                <p>
                                    <strong>Available Seats:</strong> {trip.available_seats}
                                </p>
                                <button
                                    onClick={() => navigate(`/buslayout/${trip._id}`)}
                                    disabled={trip.available_seats <= 0}
                                    style={{
                                        background: trip.available_seats > 0 ? "#28a745" : "#ccc",
                                        color: "#fff",
                                        padding: "10px",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: trip.available_seats > 0 ? "pointer" : "not-allowed",
                                    }}
                                >
                                    {trip.available_seats > 0 ? "Book Now" : "Full"}
                                </button>

                            </div>
                        ))}
                    </div>
                ) : loading ? (
                    <p>Loading trips...</p>
                ) : (
                    <p>No trips found. Try a different search.</p>
                )}
            </div>
        </div>
    );
};

export default TripSearch;
