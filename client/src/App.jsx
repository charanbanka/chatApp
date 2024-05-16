import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserContext } from "./components/context/user-context";
import ProtectedRoute from "./ProtectedRoute"; // import the ProtectedRoute component
import Chat from "./pages/Chat";

const App = () => {
  const { user, allUsers } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiresIn = new Date(localStorage.getItem("expiresIn"));
    const currentPath = window.location.pathname;

    if (!token || expiresIn <= new Date()) {
      localStorage.clear();
      if (currentPath !== "/login" && currentPath !== "/register") {
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute element={<Chat />} user={user} allUsers={allUsers} />
        }
      />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Register />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
