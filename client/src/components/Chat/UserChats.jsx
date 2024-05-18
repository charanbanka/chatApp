import React, { useContext, useMemo } from "react";
import { getUserFromChat, unreadNotificationsFunc } from "../../utils";
import { UserContext } from "../context/user-context";
import { ChatContext } from "../context/chat-context";
import { List } from "@mui/material";
import UserChatBox from "./UserChatBox";

const UserChats = ({userWiseNotificationsMap}) => {
  const { user, allUsers } = useContext(UserContext);
  const { userChats, notifications } = useContext(ChatContext);

 

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
          userChats.map((chat, idx) => {
            const _user = getUserFromChat(user._id, chat.members, allUsers);
            return (
              <UserChatBox
                key={chat._id}
                chat={chat}
                curChatUser={_user}
                thisUserNotification={userWiseNotificationsMap.get(_user._id)}
              />
            );
          })}
      </List>
    </div>
  );
};

export default UserChats;
