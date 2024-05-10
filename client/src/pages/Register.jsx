import React, { useState } from "react";
import Auth from "../components/Auth";
import config from "../common/config";
import ServiceRequest from "../utils/service-request";

const Register = () => {
  const [form, setForm] = useState({});

  const signUpUser = async (data) => {
    let url = `${config.baseurl}/signup`;
    let resp = await ServiceRequest({ url, method: "POST", data });
    console.log("resp", resp);
  };

  return (
    <Auth
      title="Sign Up"
      signIn={false}
      setState={signUpUser}
      redirectUrl={"/login"}
    />
  );
};

export default Register;
