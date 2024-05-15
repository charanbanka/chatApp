import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import _const from "../../common/const";
import config from "../../common/config";
import ServiceRequest from "../../utils/service-request";
import {
  Button,
  CircularProgress,
  Container,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const initial_form_values = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
export default function Auth({ setState, signIn, redirectUrl }) {
  const [formData, setFormData] = useState(initial_form_values);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    vertical: "top",
    horizontal: "center",
  });
  const { user, updateUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  const { open, message, vertical, horizontal } = notification || {};

  useEffect(() => {
    if (user.name) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const loginUser = async (data) => {
    setLoading(true);
    let url = `${config.baseurl}/login`;
    let resp = await ServiceRequest({ url, method: "POST", data });

    let respData = resp?.data;
    setLoading(false);

    if (respData.status == _const.SERVICE_FAILURE) {
      setError(respData.message);
      return;
    }
    setNotification((prev) => {
      return { ...prev, open: true, message: "Login Success!" };
    });
    setError("");
    localStorage.setItem("token", respData.data.token);
    localStorage.setItem("expiresIn", respData.data.expiresIn);
    updateUserDetails(respData.data);
    navigate("/");
  };

  const signUp = async (data) => {
    setLoading(true);
    let url = `${config.baseurl}/signup`;
    let resp = await ServiceRequest({ url, method: "POST", data });

    let respData = resp?.data;
    setLoading(false);

    if (respData.status == _const.SERVICE_FAILURE) {
      setError(respData.message);
      return;
    }
    setNotification((prev) => {
      return { ...prev, open: true, message: "Successfully Registered!" };
    });
    setError("");
    setFormData({});
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (signIn) {
      // Perform login action
      loginUser(formData);
    } else {
      // Perform signup action
      signUp(formData);
    }
  };
  const handleClose = () => {
    setNotification((prev) => {
      return { ...prev, open: false, message: "" };
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        width: "100%",
        transform: "translateY(-50%)",
      }}
    >
      <Container maxWidth="xs">
        <div style={{ width: "100%" }}>
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
                {loading ? (
                  <CircularProgress />
                ) : signIn ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
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
        </div>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          message={message}
          key={vertical + horizontal}
        />
      </Container>
    </div>
  );
}
