import React, { useContext, useEffect, useMemo } from "react";
import { ListItemContent, ListItemDecorator } from "@mui/joy";
import {
  checkIsUserOnline,
  getFormattedTime,
  getRandomColor,
  getUserById,
  getUserFromChat,
  getUserIdFromMembers,
  unreadNotificationsFunc,
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

const UserChatBox = ({ chat, curChatUser, userWiseNotificationsMap }) => {
  const { latestMessage } = useFetchLatestMessage(chat._id);
  const {
    userChats,
    currentChat,
    currentChatUser,
    updateCurrentChatAndUser,
    messages,
    onlineUsers,
    notifications,
    markNotificationAsRead,
  } = useContext(ChatContext);
  const { user } = useContext(UserContext);
  console.log("ltess", latestMessage);
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
                fontSize: "16px",
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
                  {getFormattedTime(latestMessage?.createdAt)}
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
              variant="caption"
              sx={{
                color: "lightgray",
                fontWeight: 500,
                textSize: "12px",
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
              {userWiseNotificationsMap.get(curChatUser?._id) && (
                <Badge
                  badgeContent={userWiseNotificationsMap.get(curChatUser?._id)}
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
