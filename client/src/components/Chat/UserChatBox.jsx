import React, { useContext, useEffect, useMemo, useState } from "react";
import { ListItemContent, ListItemDecorator } from "@mui/joy";
import {
  checkIsUserOnline,
  getFormattedTime,
  getFormattedTimeForUserChats,
  getRandomColor,
} from "../../utils";
import { UserContext } from "../context/user-context";
import { ChatContext } from "../context/chat-context";
import {
  Avatar,
  Badge,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import useFetchLatestMessage from "../hooks/useFetchLatestMessage";

const UserChatBox = ({ chat, curChatUser, thisUserNotification }) => {
  // const [latestMessage, setLatestMessage] = useState({});
  const {
    userChats,
    currentChat,
    currentChatUser,
    updateCurrentChatAndUser,
    messages,
    onlineUsers,
    notifications,
    markNotificationAsRead,
    newMessage,
  } = useContext(ChatContext);
  const { user } = useContext(UserContext);
  const isCurrentUserNotification =
    notifications[0]?.senderId == curChatUser._id;

  const { latestMessage } = useFetchLatestMessage(
    chat._id,
    newMessage,
    thisUserNotification,
    isCurrentUserNotification
  );

  return (
    <Stack
      key={chat._id}
      sx={{
        bgcolor: chat?._id === currentChat?._id ? "#223851;" : "",
        cursor: "pointer",
        borderBottom: "1px solid grey",
        pt: "10px",
        pb: "10px",
        "&:hover": {
          bgcolor: "#223841;",
        },
      }}
      onClick={() => {
        markNotificationAsRead(
          { senderId: curChatUser?._id },
          userChats,
          notifications,
          user
        );
        updateCurrentChatAndUser(chat);
      }}
    >
      <ListItem>
        <ListItemDecorator>
          <Avatar
            sx={{
              bgcolor: getRandomColor(),
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            {curChatUser?.name?.[0]}
          </Avatar>
        </ListItemDecorator>
        <ListItemContent>
          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            <Typography
              level="title-sm"
              sx={{
                textTransform: "capitalize",
                color: "white",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {curChatUser?.name}
            </Typography>
            {checkIsUserOnline(curChatUser?._id, onlineUsers) ? (
              <Typography color="lightgreen">online</Typography>
            ) : (
              latestMessage?.createdAt && (
                <Typography variant="caption">
                  {getFormattedTimeForUserChats(latestMessage?.createdAt)}
                </Typography>
              )
            )}
          </Stack>

          <Stack
            direction={"row"}
            sx={{ justifyContent: "space-between" }}
            spacing={3}
          >
            <Typography
              level="body-sm"
              variant="subtitle1"
              sx={{
                color: "lightgray",
                fontWeight: 500,
                textSize: "16px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
              }}
            >
              {latestMessage?.text}
            </Typography>
            <Typography variant="caption">
              {thisUserNotification?.count && (
                <Badge
                  badgeContent={thisUserNotification?.count}
                  color="success"
                ></Badge>
              )}
            </Typography>
          </Stack>
        </ListItemContent>
      </ListItem>
      {/* <ListDivider
                  sx={{ backgroundColor: "#000000",m:0, p:0, ml: 1.5, mr: 1.5 }}
                /> */}
    </Stack>
  );
};

export default UserChatBox;
