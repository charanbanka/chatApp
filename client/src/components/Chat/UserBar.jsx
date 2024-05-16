import { Avatar, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { UserContext } from "../context/user-context";
import { Dropdown, MenuButton, Menu, MenuItem } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { getRandomColor } from "../../utils";
import Notification from "./Notification";
import { ChatContext } from "../context/chat-context";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const UserBar = () => {
  const [isShow, setIsShow] = useState(false);
  const { user, updateUserDetails } = useContext(UserContext);
  const { logout } = useContext(ChatContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    logout();
    updateUserDetails(null);
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
      <Stack direction={"row"} spacing={2} sx={{ alignItems: "center" }}>
        <Notification />
        <Dropdown>
          <MenuButton
            sx={{
              backgroundColor: "transparent",
              border: "none",
              p: 0,
              "&:hover": {
                backgroundColor: "transparent",
                border: "none",
                p: 0,
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: getRandomColor(),
                cursor: "pointer",
                textTransform: "uppercase",
                position: "relative",
                transition: "transform 0.3s", // Add transition for smooth effect
                "&:hover": {
                  transform: "scale(1.1)", // Scale down by 10% on hover
                  color: "black",
                },
              }}
              onClick={() => setIsShow(!isShow)}
            >
              {user?.name && user?.name?.[0]}
            </Avatar>
          </MenuButton>
          <Menu>
            <MenuItem sx={{ textTransform: "capitalize" }}>
              {user.name}
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
              Logout
            </MenuItem>
          </Menu>
        </Dropdown>
        <MoreVertIcon
          sx={{ cursor: "pointer", "&:hover": { color: "lightgrey" } }}
        />
      </Stack>
    </Stack>
  );
};

export default UserBar;
