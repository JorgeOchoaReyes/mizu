import React from "react";
import { Box, CircularProgress } from "@mui/material";

export const Loading = () => (
  <Box
    sx={{
      width: "100%",
      height: "70vh",
      alignContent: "center",
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
    }}
  >
    {" "}
    <CircularProgress />{" "}
  </Box>
);

export default Loading;
