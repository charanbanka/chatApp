import React, { useContext, useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
import LeftBar from "../components/Chat/LeftBar";
import ChatMessages from "../components/Chat/ChatMessages";
import constants from "../common/const";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/context/user-context";
import ProgressLoader from "../components/ProgressLoader";
import { ChatContext } from "../components/context/chat-context";
import { MessageContextComponent } from "../components/context/message-context";

const Chat = () => {
  const { user } = useContext(UserContext);
  const { currentChat } = useContext(ChatContext);
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
  if (!user._id) return <ProgressLoader />;

  return (
    <div>
      <MessageContextComponent user={user} currentChat={currentChat}>
        <Grid container>
          <Grid item xs={3.5}>
            <LeftBar />
          </Grid>
          <Grid item xs={8.5}>
            <ChatMessages currentChat={currentChat} />
          </Grid>
        </Grid>
      </MessageContextComponent>
    </div>
  );
};

export default Chat;
