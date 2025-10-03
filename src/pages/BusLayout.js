import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios";
import "../styles/BusLayout.css";

const BusLayout = () => {
    const { tripId } = useParams(); // Get tripId from the route
    const [tripDetails, setTripDetails] = useState(null); // To store trip details
    const [bookedSeats, setBookedSeats] = useState([]); // Seats already booked
    const [selectedSeats, setSelectedSeats] = useState([]); // Seats user selects
    const navigate = useNavigate();

    // Fetch trip details when component mounts
    useEffect(() => {
        console.log("BusLayout loaded for Trip ID:", tripId);
        const fetchTripDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("No token found. Please log in again.");
                    navigate("/login");
                    return;
                }

                const response = await axios.get(`/trips/${tripId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTripDetails(response.data);

                // Fetch booked seats dynamically from backend (reservations)
                const bookedSeatsFromReservations = response.data.reservations
                    ?.flatMap((res) => res.seat_numbers) || [];
                setBookedSeats(bookedSeatsFromReservations); 
            } catch (error) {
                console.error("Error fetching trip details:", error);
                if (error.response?.status === 401) {
                    alert("Access denied. Please log in.");
                    navigate("/login");
                } else if (error.response?.status === 404) {
                    alert("Trip not found.");
                    navigate("/tripsearch");
                } else {
                    alert("Failed to fetch trip details. Please try again later.");
                }
            }
        };

        fetchTripDetails();
    }, [tripId, navigate]);

    // Handle user clicking on a seat
    const handleSeatClick = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) {
            return; // Booked seats are not clickable
        }
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };

    // Handle reservation submission
    const handleReservation = async () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("No token found. Please log in again.");
                navigate("/login");
                return;
            }

            await axios.post(
                `/reservations`,
                { trip_id: tripId, bus_id: tripDetails.bus_id._id, seat_numbers: selectedSeats }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Reservation successful!");

            // Update booked seats after successful reservation
            setBookedSeats([...bookedSeats, ...selectedSeats]);
            setSelectedSeats([]); // Clear selected seats
        } catch (error) {
            console.error("Error creating reservation:", error);
            alert(error.response?.data?.error || "Failed to create reservation.");
        }
    };

    if (!tripDetails) {
        return <p>Loading bus layout...</p>;
    }

    const { bus_id, route_id } = tripDetails;

    return (
        <div className="bus-layout">
            <h1>Bus Layout: {bus_id?.bus_number || "Unknown Bus"}</h1>
            <p>
                <strong>Route:</strong> {route_id?.start_point} to {route_id?.end_point}
            </p>
            <p>
                <strong>Departure:</strong> {new Date(tripDetails.departure_time).toLocaleString()}
            </p>
            <p>
                <strong>Arrival:</strong> {new Date(tripDetails.arrival_time).toLocaleString()}
            </p>
            <div className="seats-container">
                {Array.from({ length: bus_id?.capacity || 0 }).map((_, index) => {
                    const seatNumber = index + 1;
                    const isBooked = bookedSeats.includes(seatNumber); // Check if seat is booked
                    const isSelected = selectedSeats.includes(seatNumber); // Check if seat is selected
                    return (
                        <div
                            key={seatNumber}
                            className={`seat ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                            onClick={() => !isBooked && handleSeatClick(seatNumber)} // Disable click on booked seats
                            title={isBooked ? "This seat is already booked." : `Seat ${seatNumber}`}
                        >
                            {seatNumber}
                        </div>
                    );
                })}
            </div>

            <button onClick={handleReservation} className="confirm-btn">
                Confirm Reservation
            </button>
        </div>
    );
};

export default BusLayout;
