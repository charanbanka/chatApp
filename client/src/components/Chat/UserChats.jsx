import React, { useContext } from "react";
import { ListItemContent, ListItemDecorator } from "@mui/joy";
import {
  getFormattedTime,
  getRandomColor,
  getUserById,
  getUserFromChat,
  getUserIdFromMembers,
} from "../../utils";
import { UserContext } from "../context/user-context";
import { ChatContext } from "../context/chat-context";
import { Avatar, List, ListItem, Stack, Typography } from "@mui/material";
import { MessageContext } from "../context/message-context";

const UserChats = () => {
  const { user, allUsers } = useContext(UserContext);
  const { userChats, currentChat, updateCurrentChatAndUser, messages } =
    useContext(ChatContext);

  return (
    <div
      style={{
        overflowY: "auto",
        maxHeight: "calc(100vh - 120px)",
        mt: "10px",
      }}
    >
      <List
        aria-labelledby="ellipsis-list-demo"
        sx={{
          "--ListItemDecorator-size": "56px",
          color: "white",
          pb: 0,
        }}
      >
        {userChats.length > 0 &&
          userChats.map((item, idx) => {
            const _user = getUserFromChat(user._id, item.members, allUsers);

            return (
              <Stack
                key={item._id}
                sx={{
                  bgcolor: item?._id === currentChat?._id ? "#223851;" : "",
                  cursor: "pointer",
                  borderBottom: "1px solid grey",
                  pt: "10px",
                  pb: "10px",
                  "&:hover": {
                    bgcolor: "#223841;",
                  },
                }}
                onClick={() => {
                  updateCurrentChatAndUser(item);
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
                      {_user?.name?.[0]}
                    </Avatar>
                  </ListItemDecorator>
                  <ListItemContent>
                    <Stack
                      direction={"row"}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography
                        level="title-sm"
                        sx={{
                          textTransform: "capitalize",
                          color: "white",
                          fontSize: "16px",
                          fontWeight: 700,
                        }}
                      >
                        {_user?.name}
                      </Typography>
                      {messages?.[messages.length - 1]?.createdAt && (
                        <Typography variant="caption">
                          {getFormattedTime(
                            messages?.[messages.length - 1]?.createdAt
                          )}
                        </Typography>
                      )}
                    </Stack>

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
                      {messages?.[messages.length - 1]?.text}
                    </Typography>
                  </ListItemContent>
                </ListItem>
                {/* <ListDivider
                  sx={{ backgroundColor: "#000000",m:0, p:0, ml: 1.5, mr: 1.5 }}
                /> */}
              </Stack>
            );
          })}
      </List>
    </div>
  );
};

export default UserChats;
