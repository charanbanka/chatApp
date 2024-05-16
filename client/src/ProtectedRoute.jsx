import React from "react";
import { Navigate } from "react-router-dom";
import { ChatContextComponent } from "./components/context/chat-context";

const ProtectedRoute = ({ element, user, allUsers }) => {
  return user ? (
    <ChatContextComponent user={user} allUsers={allUsers}>
      {element}
    </ChatContextComponent>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
