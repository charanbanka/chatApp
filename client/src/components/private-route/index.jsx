import React from "react";
import { Route } from "react-router-dom";
import constants from "../../common/const";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const token = localStorage.getItem(constants.TOKEN);
  const navigate = useNavigate();

  if (!token) {
    navigate("/login");
    return null; // You can return null or some loading indicator here
  }

  return <Route {...rest} element={<Element />} />;
};

export default PrivateRoute;
