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
import {
  getFormattedTime,
  getFormattedTimeForMessages,
  getRandomColor,
  getUserFromChat,
} from "../../utils";
import _const from "../../common/const";
import config from "../../common/config";
import ServiceRequest from "../../utils/service-request";
import LockIcon from "@mui/icons-material/Lock";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CircleIcon from "@mui/icons-material/Circle";
import { ChatContext } from "../context/chat-context";
import InputEmoji from "react-input-emoji";

const ChatMessages = () => {
  const { user, allUsers } = useContext(UserContext);
  const {
    messages,
    setMessages,
    sendMessageToUser,
    currentChat,
    isCurrentChatOnline,
    newMessage,
    setNewMessage,
  } = useContext(ChatContext);

  const textRef = useRef();
  const latestMessageRef = useRef(null);
  // Scroll to the latest message when messages change
  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({});
    }
  }, [messages]);
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

  const SendMessage = () => {
    const [message, setMessage] = useState("");

    const handleSubmit = (event) => {
      event.preventDefault(); // Prevent default form submission behavior
      // Add your logic to handle the submission here
      console.log("Message submitted:", message);
      // You can clear the input field after submission if needed
      const text = message.trim();
      const senderId = user?._id;
      const chatId = currentChat?._id;
      if (!text || !senderId || !chatId) return;
      sendMessageToUser({ senderId, chatId, text });
      setMessage("");
    };

    const handleKeyPress = (event) => {
      if (event.key === "Enter" && event.shiftKey === false) {
        event.preventDefault(); // Prevent the default behavior of the Enter key
        handleSubmit(event);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <Stack
          direction="row"
          sx={{
            bgcolor: "#335667",
            p: 1.5,
            color: "white",
            position: "absolute",
            bottom: 0,
            width: "69%",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <InputEmoji
            value={message}
            onChange={setMessage}
            cleanOnEnter
            placeholder="Type a Message"
            borderColor="#aebac1"
            borderRadius="10px"
            areaHeight="30px"
            areaWidth="calc(100% - 60px)" // Adjust width to accommodate the icon
            areaMaxHeight="150px"
            areaMinHeight="30px"
            disableRecentEmoji={true}
            disableSearchBar={true}
            disableSkinTonePicker={true}
            onKeyDown={handleKeyPress}
            sx={{ fontSize: "24px" }}
          />
          <div
            style={{ display: "flex", alignItems: "center", marginLeft: "1px" }}
          >
            <SendIcon
              style={{
                cursor: "pointer",
                textAlign: "center",
                color: message ? "#ffffff" : "action",
              }}
              onClick={handleSubmit}
            />
          </div>
        </Stack>
      </form>
    );
  };

  const ShowMessages = () => {
    return (
      <Stack sx={{ p: 1, color: "white", overflowY: "auto", height: "82%" }}>
        <Typography
          sx={{ textAlign: "center", color: "grey", textAlign: "center" }}
        >
          <LockIcon size="small" sx={{ fontSize: "16px" }} />
          Messages and calls are end-to-end encrypted
        </Typography>

        <List sx={{ p: 2 }}>
          {messages?.length > 0 &&
            messages.map((msg, idx) => {
              let formatedTimeArray = getFormattedTimeForMessages(
                msg.createdAt
              ).split("&");
              let prevMessageTimeArray =
                idx == 0
                  ? []
                  : getFormattedTimeForMessages(
                      messages[idx - 1].createdAt
                    ).split("&");

              let isLabelShow = false;
              if (idx == 0 || prevMessageTimeArray[0] !== formatedTimeArray[0])
                isLabelShow = true;

              prevMessageTimeArray = formatedTimeArray;
              return (
                <ListItem key={msg._id} sx={{ p: 0 }}>
                  <Stack
                    direction={"column"}
                    sx={{
                      justifyContent:
                        msg.senderId === user._id ? "flex-end" : "flex-start",
                      m: 0,
                      p: 0,
                      mb: 0.7,
                      width: "100%",
                    }}
                    ref={idx === messages.length - 1 ? latestMessageRef : null}
                    spacing={1}
                  >
                    {isLabelShow ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <Paper
                          sx={{
                            pl: 1.5,
                            pr: 1.5,
                            pt: 0.5,
                            pb: 0.5,
                            bgcolor: "rgb(33 35 40)",
                            color: "#dde7ee",
                            borderRadius: "10px",
                          }}
                        >
                          {formatedTimeArray[0]}
                        </Paper>
                      </div>
                    ) : (
                      ""
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          msg.senderId === user._id ? "flex-end" : "flex-start",
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
                            paddingLeft: "30px",
                            color:
                              msg.senderId === user._id
                                ? "rgb(179 ,164, 163)"
                                : "#d1c6c6",
                          }}
                        >
                          {formatedTimeArray[1].trim()}
                        </p>
                      </Paper>
                    </div>
                  </Stack>
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
                transition: "transform 0.3s", // Add transition for smooth effect
                "&:hover": {
                  transform: "scale(1.2)", // Scale down by 10% on hover
                  color: "white",
                },
              }}
              // onClick={() => setIsShow(!isShow)}
            >
              {chatUser?.name && chatUser?.name?.[0]}
            </Avatar>
            <Stack sx={{ alignItems: "center" }}>
              <Typography
                sx={{ color: "white", fontSize: "18px", fontWeight: 700 }}
              >
                {chatUser.name}
              </Typography>
              {isCurrentChatOnline && (
                <Stack direction={"row"} sx={{ alignItems: "left" }}>
                  <Typography sx={{ color: "lightgreen", fontSize: "16px" }}>
                    {" "}
                    {"online"}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
          <Stack>
            <MoreVertIcon sx={{ cursor: "pointer" }} />
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
