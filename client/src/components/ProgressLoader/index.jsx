import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

function ProgressLoader() {
  return (
    <Stack
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <CircularProgress />
    </Stack>
  );
}

export default ProgressLoader;
