import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserContext } from "./components/context/user-context";
import { ChatContextComponent } from "./components/context/chat-context";
import Chat from "./pages/Chat";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <ChatContextComponent user={user}>
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
