import React, { useContext, useState } from "react";
import { Badge, Button, Snackbar, Stack, Typography } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import CloseIcon from "@mui/icons-material/Close";
import { ChatContext } from "../context/chat-context";
import { UserContext } from "../context/user-context";
import { getFormattedTime, unreadNotificationsFunc } from "../../utils";

const Notification = () => {
  const [open, setOpen] = useState(false);
  const { user, allUsers } = useContext(UserContext);
  const {
    userChats,
    currentChat,
    notifications,
    markAllNotificationsAsread,
    markNotificationAsRead,
  } = useContext(ChatContext);
  const [notificationCount, setNotificationCount] = useState(1);

  const unreadNotifications = unreadNotificationsFunc(notifications);

  const modifiedNotifications = notifications.map((n) => {
    const senderUser = allUsers.find((u) => u._id === n.senderId);
    return { ...n, senderName: senderUser?.name };
  });

  console.log("un", unreadNotifications);
  console.log("mn", modifiedNotifications);

  const handleNotification = () => {
    setOpen(!open);
  };

  const handleNotificationClick = (n) => {
    markNotificationAsRead(n, userChats, notifications, user);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <Badge badgeContent={unreadNotifications.length} color="error">
        <ChatBubbleIcon
          onClick={handleNotification}
          sx={{
            cursor: "pointer",
            color: "lightgrey",
            "&:hover": { color: "white" },
          }}
        />
      </Badge>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "25px",
            backgroundColor: "rgb(1 15 30)",
            zIndex: "999",
            width: "270px",
            borderRadius: "8px",
          }}
        >
          <Stack
            direction={"row"}
            spacing={2}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{ padding: "8px 9px" }}
          >
            <Typography variant="h6">Notifications</Typography>
            <Typography
              variant="body"
              color={unreadNotifications?.length ? "white" : "grey"}
              sx={{ cursor: "pointer", "&:hover": { color: "lightblue" } }}
              onClick={() => markAllNotificationsAsread(notifications)}
            >
              Mark all as read
            </Typography>
          </Stack>
          <Stack>
            {modifiedNotifications?.length ? (
              modifiedNotifications.map((n, idx) => {
                return (
                  <Stack
                    key={n?._id + idx}
                    bgcolor={n.isRead ? "" : "#052c54"}
                    sx={{
                      p: 1,
                      borderBottom: "1px solid grey",
                      cursor: "pointer",
                    }}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <Typography variant="body1">
                      {n.senderName} sent you a new message
                    </Typography>
                    <Typography
                      variant="caption"
                      color={"grey"}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {getFormattedTime(n.date)}
                    </Typography>
                  </Stack>
                );
              })
            ) : (
              <Stack bgcolor="#053c74" sx={{ p: 1 }}>
                <Typography variant="caption">
                  No notifications yet...
                </Typography>
              </Stack>
            )}
          </Stack>
        </div>
      )}
    </div>
  );
};

export default Notification;
