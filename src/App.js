import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/DashboardPage";
import Buses from "./pages/Buses";
import RoutesPage from "./pages/Routes";
import Login from "./pages/LoginPage";
import Users from "./pages/Users";
import TripManagement from "./pages/TripManagement";
import TripSearch from "./pages/TripSearch";
import BusLayout from "./pages/BusLayout";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<TripSearch />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/buses" element={<Buses />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/users" element={<Users />} />
          <Route path="/tripmanagement" element={<TripManagement />} />
          <Route path="/tripsearch" element={<TripSearch />} />
          <Route path="/buslayout/:tripId" element={<BusLayout />} />
          <Route path="/dashboardpage" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
