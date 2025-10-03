import React, { useEffect, useState } from "react";
import axios from "../axios";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReservations, setFilteredReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get("/reservations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReservations(res.data);
      setFilteredReservations(res.data); // Initialize with all reservations
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
      alert("Failed to fetch reservations.");
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = reservations.filter(
      (res) =>
        res.ticket_id.toLowerCase().includes(searchValue) ||
        res.user_id?.name.toLowerCase().includes(searchValue)
    );

    setFilteredReservations(filtered);
  };

  return (
    <div>
      <h1>Reservations</h1>
      <input
        type="text"
        placeholder="Search by Ticket ID or Username"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
      />
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
          {filteredReservations.length > 0 ? (
            filteredReservations.map((res) => (
              <tr key={res._id}>
                <td>{res.ticket_id}</td>
                <td>{res.user_id?.name || "Unknown"}</td>
                <td>{res.bus_id?.bus_number || "N/A"}</td>
                <td>{res.seat_numbers.join(", ")}</td>
                <td>{res.total_fare}</td>
                <td>{res.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No reservations found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reservations;
