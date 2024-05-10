import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserContextComponent } from "./components/context/user-context";
import PrivateRoute from "./components/private-route";

const App = () => {
  return (
    <BrowserRouter>
      <CssBaseline />
      <UserContextComponent>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </UserContextComponent>
    </BrowserRouter>
  );
};

export default App;
