import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserContext } from "./components/context/user-context";
import { ChatContextComponent } from "./components/context/chat-context";
import Chat from "./pages/Chat";

const App = () => {
  const { user, allUsers } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    let expiresIn = localStorage.getItem("expiresIn");
    if (!expiresIn && expiresIn <= new Date()) {
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  return (
    <ChatContextComponent user={user} allUsers={allUsers}>
      <Routes>
        <Route
          path="/"
          element={user?._id ? <Chat /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={user?._id ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={user?._id ? <Navigate to="/" /> : <Register />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ChatContextComponent>
  );
};

export default App;
