import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import "../styles/LoginPage.css";

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting to login with email:", email);

    try {
      const response = await axios.post("/users/login", { email, password });
      console.log("Login response:", response.data);

      const { token, role } = response.data;

      if (!token || !role) {
        throw new Error("Invalid response from server.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      setIsAuthenticated(true);

      if (role === "commuter") {
        navigate("/"); // Redirect to TripSearch for commuters
      } else {
        navigate("/dashboard"); // Redirect to dashboard for admin/operator
      }
    } catch (error) {
      console.error("Login error:", error.response || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <ion-icon name="mail-outline"></ion-icon>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <ion-icon name="lock-closed-outline"></ion-icon>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="show-hide"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <div className="footer">
        <span onClick={() => navigate("/register")}>Create Account</span>
      </div>
    </div>
  );
};

export default LoginPage;
