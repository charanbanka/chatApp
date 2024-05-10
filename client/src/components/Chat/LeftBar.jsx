import React from "react";
import UserBar from "./UserBar";
import { Grid, Stack, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UserChats from "./UserChats";

const LeftBar = () => {
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
              width: "90%",
              borderRadius: "8px",
              boxShadow: "10px 1px",
            }}
          />
        </Grid>
        <Grid item xs={2} sx={{ textAlign: "center" }}>
          <AddIcon />
        </Grid>
      </Grid>

      <UserChats />
    </Stack>
  );
};

export default LeftBar;
