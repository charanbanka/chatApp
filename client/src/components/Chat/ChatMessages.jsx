import {
  Stack,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import { UserContext } from "../context/user-context";
import { Avatar, Typography } from "@mui/joy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import { getFormattedTime, getRandomColor, getUserFromChat } from "../../utils";
import _const from "../../common/const";
import config from "../../common/config";
import ServiceRequest from "../../utils/service-request";
import { MessageContext } from "../context/message-context";
import LockIcon from "@mui/icons-material/Lock";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const ChatMessages = ({ currentChat }) => {
  const { user, allUsers } = useContext(UserContext);
  const { messages, setMessages, sendMessageToUser } =
    useContext(MessageContext);
  const textRef = useRef();

  if (!currentChat?._id)
    return (
      <Stack
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          bgcolor: "#16252d;",
          color: "white",
        }}
      >
        <HourglassEmptyIcon />
        <Typography color="grey" sx={{ mt: 1 }}>
          {" "}
          <LockIcon size="small" sx={{ fontSize: "16px" }} />
          Your Messages are end-to-end encrypted
        </Typography>
      </Stack>
    );

  console.log("mesages", messages);

  const handleSubmit = () => {
    console.log(textRef.current.value);
    const text = textRef.current.value;
    const senderId = user?._id;
    const chatId = currentChat?._id;
    if (!text.trim() || !senderId || !chatId) return;
    sendMessageToUser({ senderId, chatId, text });
    textRef.current.value = "";
  };

  const SendMessage = () => {
    return (
      <Stack
        direction={"row"}
        sx={{
          bgcolor: "#335667;",
          p: 1.5,
          color: "white",
          position: "absolute",
          bottom: "0",
          width: "69%",
        }}
      >
        <TextField
          size="small"
          sx={{
            width: "94%",
            color: "white", // Change text color to white
            bgcolor: "#aebac1;",
            borderRadius: "10px",
          }}
          placeholder="Type a Message"
          inputRef={textRef}
        />
        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "16px" }}
        >
          <SendIcon
            color="action"
            sx={{
              cursor: "pointer",
              textAlign: "center",
              "&:hover": {
                color: "#ffffff",
              },
            }}
            onClick={handleSubmit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        </div>
      </Stack>
    );
  };

  const ShowMessages = () => {
    return (
      <Stack sx={{ p: 1, color: "white", overflowY: "auto", height: "85%" }}>
        <Typography
          sx={{ textAlign: "center", color: "grey", textAlign: "center" }}
        >
          <LockIcon size="small" sx={{ fontSize: "16px" }} /> Messages and calls
          are end-to-end
        </Typography>

        <List sx={{ p: 2 }}>
          {messages.length > 0 &&
            messages.map((msg) => {
              return (
                <ListItem
                  key={msg._id}
                  sx={{
                    justifyContent:
                      msg.senderId === user._id ? "flex-end" : "flex-start",
                    m: 0,
                    p: 0,
                    mb: 0.7,
                  }}
                >
                  <Paper
                    sx={{
                      display: "inline-block",
                      pl: 1,
                      pr: 1,
                      bgcolor:
                        msg.senderId === user._id ? "#005c4b;" : "#636b74;",
                      borderRadius: "8px",
                      color: "#dde7ee",
                      maxWidth: "60%",
                    }}
                  >
                    <ListItemText
                      primary={msg.text}
                      sx={{ padding: "0", margin: "0", paddingTop: "5px" }}
                    />

                    <p
                      style={{
                        fontSize: "12px",
                        textAlign: "right",
                        margin: 0,
                        padding: 0,
                        paddingBottom: "5px",
                        color:
                          msg.senderId === user._id
                            ? "rgb(179 ,164, 163)"
                            : "#d1c6c6;",
                      }}
                    >
                      {getFormattedTime(msg.createdAt)}
                    </p>
                  </Paper>
                </ListItem>
              );
            })}
        </List>
      </Stack>
    );
  };

  const ShowChatUserInfo = () => {
    const chatUser = getUserFromChat(user?._id, currentChat.members, allUsers);
    return (
      <Paper sx={{ bgcolor: "#335667;", color: "white" }}>
        <Stack
          direction={"row"}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            color: "white",
          }}
        >
          <Stack
            direction={"row"}
            textAlign={"center"}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            spacing={1}
          >
            <Avatar
              sx={{
                bgcolor: getRandomColor(),
                cursor: "pointer",
                textTransform: "uppercase",
                position: "relative",
              }}
              onClick={() => setIsShow(!isShow)}
            >
              {chatUser?.name && chatUser?.name?.[0]}
            </Avatar>
            <Stack sx={{ alignItems: "center" }}>
              <Typography
                sx={{ color: "white", fontSize: "18px", fontWeight: 700 }}
              >
                {chatUser.name}
              </Typography>
              {/* <Stack direction={"row"} sx={{ alignItems: "center" }}>
            <CircleIcon color="success" fontSize="8px" />
            <Typography sx={{ color: "white", fontSize: "16px" }}>
              {" "}
              {"online"}
            </Typography>
          </Stack> */}
            </Stack>
          </Stack>
          <Stack>
            <MoreVertIcon />
          </Stack>
        </Stack>
        <Stack></Stack>
      </Paper>
    );
  };

  return (
    <Stack
      sx={{
        background: "#16252d;",
        height: "calc(100vh)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ShowChatUserInfo />
      <ShowMessages />
      <SendMessage />
    </Stack>
  );
};

export default ChatMessages;
