import React, { useContext, useMemo, useState } from "react";
import UserBar from "./UserBar";
import { Grid, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UserChats from "./UserChats";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import { UserContext } from "../context/user-context";
import config from "../../common/config";
import ServiceRequest from "../../utils/service-request";
import { ChatContext } from "../context/chat-context";
import _const from "../../common/const";
import { unreadNotificationsFunc } from "../../utils";

const LeftBar = () => {
  const [isNewChat, setIsNewChat] = useState(false);
  const { user, allUsers } = useContext(UserContext);
  const { userChats, handleCreateChat, notifications } =
    useContext(ChatContext);
  const unreadNotifications = unreadNotificationsFunc(notifications);

  const userWiseNotificationsMap = useMemo(() => {
    let map = new Map();
    unreadNotifications.map((un) => {
      const senderUser = allUsers.find((u) => u._id == un.senderId);
      let value = map.get(un.senderId) || {
        count: 0,
        senderName: senderUser.name,
        senderId: un.senderId,
        date: un.date,
      };
      map.set(un.senderId, {
        ...value,
        count: value.count + 1,
        date: un.date,
      });
    });
    map.set("total", { count: unreadNotifications.length });
    return map;
  }, [notifications]);

  return (
    <Stack
      sx={{
        background: "#1d4a65;",
        color: "white",
        height: "100%",
        borderRight: "1px solid grey",
      }}
      spacing={1}
    >
      <UserBar userWiseNotificationsMap={userWiseNotificationsMap} />

      <Grid container>
        <Grid item xs={10} sx={{ textAlign: "center" }}>
          <input
            placeholder="Search..."
            style={{
              padding: "8px",
              width: "85%",
              borderRadius: "8px",
              boxShadow: "10px 1px",
            }}
          />
        </Grid>
        <Grid item xs={2} sx={{ textAlign: "center" }}>
          <Dropdown>
            <MenuButton size="sm">
              <AddIcon
                sx={{ cursor: "pointer", color: "red" }}
                onClick={() => setIsNewChat(!isNewChat)}
              />
            </MenuButton>
            <Menu size="sm">
              {allUsers.length > 0 &&
                allUsers.map((item) => {
                  if (item._id == user._id) return;
                  return (
                    <MenuItem
                      sx={{
                        textTransform: "capitalize",
                        "&:hover": { bgcolor: "blue" },
                      }}
                      key={item._id}
                      onClick={() => handleCreateChat(user, item, userChats)}
                    >
                      {item.name}
                    </MenuItem>
                  );
                })}
            </Menu>
          </Dropdown>
        </Grid>
      </Grid>

      <UserChats userWiseNotificationsMap={userWiseNotificationsMap} />
    </Stack>
  );
};

export default LeftBar;
