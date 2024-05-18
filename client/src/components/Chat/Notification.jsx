import React, { useContext, useState } from "react";
import { Badge, Button, Snackbar, Stack, Typography } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import CloseIcon from "@mui/icons-material/Close";
import { ChatContext } from "../context/chat-context";
import { UserContext } from "../context/user-context";
import { getFormattedTime, unreadNotificationsFunc } from "../../utils";

const Notification = ({ userWiseNotificationsMap }) => {
  const [open, setOpen] = useState(false);
  const { user, allUsers } = useContext(UserContext);
  const {
    userChats,
    currentChat,
    notifications,
    setNotifications,
    markAllNotificationsAsread,
    markNotificationAsRead,
  } = useContext(ChatContext);

  const unreadNotificationsCount =
    userWiseNotificationsMap.get("total")?.count || 0;

  const handleNotification = () => {
    setOpen(!open);
  };

  const handleNotificationClick = (n) => {
    markNotificationAsRead(n, userChats, notifications, user);
    setOpen(false);
  };
  console.log("userWiseNotificationsMap", userWiseNotificationsMap);
  return (
    <div style={{ position: "relative" }}>
      <Badge badgeContent={unreadNotificationsCount} color="error">
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
              color={unreadNotificationsCount ? "white" : "grey"}
              sx={{ cursor: "pointer", "&:hover": { color: "#0fffff" } }}
              onClick={() => {
                if (unreadNotificationsCount) setNotifications([]);
              }}
            >
              Mark all as read
            </Typography>
          </Stack>
          <Stack>
            {Array.from(userWiseNotificationsMap).map(([key, value]) => {
              if (key == "total") return;
              return (
                <Stack
                  key={key}
                  bgcolor={false ? "" : "#052c54"}
                  sx={{
                    p: 1,
                    borderBottom: "1px solid grey",
                    cursor: "pointer",
                    color:"#fffff",
                    "&:hover":{
                      bgcolor: "rgb(1 15 30)",
                      color: "#0fffff"
                    }
                  }}
                  onClick={() => handleNotificationClick(value)}
                >
                  <Typography variant="body1">
                    {`${value.senderName} sent you ${
                      value.count > 1 ? value.count : "a"
                    } new ${value.count > 1 ? "messages" : "message"}`}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={"grey"}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {getFormattedTime(value.date)}
                  </Typography>
                </Stack>
              );
            })}
            {userWiseNotificationsMap.size < 2 && (
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
