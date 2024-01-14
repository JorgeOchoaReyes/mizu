import React from "react";
import { Box } from "@mui/material";

export const Error = ({ message }: { message: string }) => (
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
    {message}{" "}
  </Box>
);
