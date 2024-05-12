import { Avatar, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { UserContext } from "../context/user-context";
import { Dropdown, MenuButton, Menu, MenuItem } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { getRandomColor } from "../../utils";
import Notification from "./Notification";

const UserBar = () => {
  const [isShow, setIsShow] = useState(false);
  const { user, updateUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    updateUserDetails({});
    navigate("/login");
  };

  return (
    <Stack
      direction={"row"}
      spacing={1}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        p: 1,
      }}
    >
      <Typography>Chats</Typography>

      <Notification/>
      <Dropdown>
        <MenuButton>
          <Avatar
            sx={{
              bgcolor: getRandomColor(),
              cursor: "pointer",
              textTransform: "uppercase",
              position: "relative",
            }}
            onClick={() => setIsShow(!isShow)}
          >
            {user?.name && user?.name?.[0]}
          </Avatar>
        </MenuButton>
        <Menu>
          <MenuItem sx={{ textTransform: "capitalize" }}>{user.name}</MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
            Logout
          </MenuItem>
        </Menu>
      </Dropdown>
    </Stack>
  );
};

export default UserBar;
