import React, { useContext, useState } from "react";
import Auth from "../components/Auth";
import { UserContext } from "../components/context/user-context";

const Login = () => {
  const { user, serUser } = useContext(UserContext);
  
  return <Auth title="Sign In" signIn={true} redirectUrl={"/register"} />;
};

export default Login;
