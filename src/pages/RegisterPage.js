import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import "../styles/LoginPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "commuter", // Default role
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users/register", formData);
      alert(response.data.message || "User registered successfully!");
      navigate("/login"); // Redirect to login after successful registration
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <ion-icon name="person-outline"></ion-icon>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <ion-icon name="mail-outline"></ion-icon>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <ion-icon name="call-outline"></ion-icon>
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <ion-icon name="lock-closed-outline"></ion-icon>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <ion-icon name="person-circle-outline"></ion-icon>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="commuter">Commuter</option>
            <option value="operator">Operator</option>
          </select>
        </div>
        <button type="submit" className="login-button">
          Register
        </button>
      </form>
      <div className="footer">
        <span onClick={() => navigate("/login")}>Already have an account? Login</span>
      </div>
    </div>
  );
};

export default RegisterPage;
