import React, { useEffect } from "react";
import { Box, Grid } from "@mui/material";
import LeftBar from "../components/Chat/LeftBar";
import ChatMessages from "../components/Chat/ChatMessages";
import constants from "../common/const";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem(constants.TOKEN);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  if (!token) {
    // Return some loading indicator or null here if needed
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={4}>
          <LeftBar />
        </Grid>
        <Grid item xs={8}>
          <ChatMessages />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chat;
