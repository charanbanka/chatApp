import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserContextComponent } from "./components/context/user-context";
import PrivateRoute from "./components/private-route";
import { ChatContextComponent } from "./components/context/chat-context";

const App = () => {
  return (
    <BrowserRouter>
      <CssBaseline />
      <UserContextComponent>
        <ChatContextComponent>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ChatContextComponent>
      </UserContextComponent>
    </BrowserRouter>
  );
};

export default App;
