import React, { useContext, useState } from "react";
import UserBar from "./UserBar";
import { Grid, Stack, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UserChats from "./UserChats";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import { UserContext } from "../context/user-context";
import config from "../../common/config";
import ServiceRequest from "../../utils/service-request";
import { ChatContext } from "../context/chat-context";
import _const from "../../common/const";

const LeftBar = () => {
  const [isNewChat, setIsNewChat] = useState(false);
  const { user, allUsers } = useContext(UserContext);
  const { allChats, chatsByUser, chatBox, fetchAllChats, updateChatBox } =
    useContext(ChatContext);

  const handleCreateChat = async (item) => {
    const members = [user._id, item._id].sort((a, b) => a - b);
    let oldChat = allChats.find((chat) => {
      const sortedMembers = chat.members.slice().sort((a, b) => a - b); // Sort the members array
      return JSON.stringify(sortedMembers) === JSON.stringify(members); // Compare sorted arrays as strings
    });

    console.log("oldChat", oldChat);
    if (oldChat) {
      updateChatBox(oldChat);
      return;
    }

    console.log("oldChat after", oldChat);

    let obj = {
      url: `${config.baseurl}/chats`,
      method: "POST",
      data: { members },
    };
    let resp = await ServiceRequest(obj);

    if (resp.data.status == _const.SERVICE_FAILURE) {
      console.log("handleCreateChat=>", resp.data);
      return;
    }

    fetchAllChats();

    console.log("handleCreateChat=>", resp.data);
  };
  return (
    <Stack
      sx={{ background: "#1d4a65;", color: "white", height: "100%" }}
      spacing={1}
    >
      <UserBar />

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
                  return (
                    <MenuItem
                      sx={{ textTransform: "capitalize" }}
                      key={item._id}
                      onClick={() => handleCreateChat(item)}
                    >
                      {item.name}
                    </MenuItem>
                  );
                })}
            </Menu>
          </Dropdown>
        </Grid>
      </Grid>

      <UserChats />
    </Stack>
  );
};

export default LeftBar;
