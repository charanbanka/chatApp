import React, { useContext } from "react";
import { ChatContext } from "../context/chat-context";
import {
  Avatar,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Stack,
  Typography,
} from "@mui/joy";
import { getRandomColor, getUserById } from "../../utils";
import { UserContext } from "../context/user-context";

const UserChats = () => {
  const { allChats, chatsByUser, chatBox, fetchAllChats, updateChatBox } =
    useContext(ChatContext);

  const { user, allUsers } = useContext(UserContext);

  const getChatId = (item) => {
    if (item[0] == user._id) {
      return item[1];
    }
    return item[0];
  };

  console.log("UserChats comp=>", chatsByUser);

  return (
    <List
      aria-labelledby="ellipsis-list-demo"
      sx={{
        "--ListItemDecorator-size": "56px",
        gap: "10px",
        mt: "10px",
        color: "white",
      }}
    >
      {chatsByUser.length > 0 &&
        chatsByUser.map((item) => {
          const _user = getUserById(getChatId(item.members), allUsers);
          return (
            <Stack key={item._id}>
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
                  <Typography
                    level="title-sm"
                    sx={{
                      textTransform: "capitalize",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    {_user?.name}
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{ color: "lightgray", fontWeight: 500 }}
                    noWrap
                  >
                    I&apos;ll be in your neighborhood doing errands this
                    Tuesday.
                  </Typography>
                </ListItemContent>
              </ListItem>
              <ListDivider
                sx={{ backgroundColor: "#000000", ml: 1.5, mr: 1.5 }}
              />
            </Stack>
          );
        })}
    </List>
  );
};

export default UserChats;
