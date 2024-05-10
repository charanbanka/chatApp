import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { Container, Typography, capitalize } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import _const from "../../common/const";
import config from "../../common/config";
import ServiceRequest from "../../utils/service-request";

const AbsoluteContainer = styled("div")({
  position: "absolute",
  top: "50%",
  left: 0,
  width: "100%",
  transform: "translateY(-50%)",
});
const initial_form_values = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
export default function Auth({ setState, signIn, redirectUrl }) {
  const [formData, setFormData] = useState(initial_form_values);
  const [error, setError] = useState("");
  const { user, updateUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (user.name) {
  //     navigate("/");
  //   }
  // }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const loginUser = async (data) => {
    let url = `${config.baseurl}/login`;
    let resp = await ServiceRequest({ url, method: "POST", data });
    console.log("resp=>", resp);
    let respData = resp?.data;
    if (respData.status == _const.SERVICE_FAILURE) {
      setError(respData.message);
      return;
    }
    setError("");
    localStorage.setItem("token", respData.data.token);
    updateUserDetails(respData.data);
    navigate("/");
  };

  const signUp = async (data) => {
    let url = `${config.baseurl}/signup`;
    let resp = await ServiceRequest({ url, method: "POST", data });
    console.log("resp=>", resp);
    let respData = resp?.data;
    if (respData.status == _const.SERVICE_FAILURE) {
      setError(respData.message);
      return;
    }
    setError("");
    setFormData({});
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signIn) {
      // Perform login action
      loginUser(formData);
      console.log("Login data:", formData);
    } else {
      // Perform signup action
      signUp(formData);
      console.log("Signup data:", formData);
    }
  };

  return (
    <AbsoluteContainer xs={{ m: 2 }}>
      <Container maxWidth="xs">
        <Box sx={{ width: "100%" }}>
          <Stack spacing={2}>
            {/* <Item color="red">{signIn ? "Sign In" : "Sign Up"}</Item> */}
            <Typography
              sx={{
                textAlign: "center",
                textTransform: "capitalize",
                color: "red",
              }}
              variant="h5"
            >
              {signIn ? "Sign In" : "Sign Up"}{" "}
            </Typography>
            <form onSubmit={handleSubmit}>
              {signIn ? null : (
                <TextField
                  name="name"
                  label="Name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
              {!signIn && (
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
              {error && (
                <Typography color={"red"} sx={{}}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {signIn ? "Sign In" : "Sign Up"}
              </Button>
            </form>
            <Button
              onClick={() => navigate(redirectUrl || "/")}
              color="secondary"
              sx={{ mt: 1 }}
            >
              {signIn ? "Create an account" : "Already have an account?"}
            </Button>
          </Stack>
        </Box>
      </Container>
    </AbsoluteContainer>
  );
}
