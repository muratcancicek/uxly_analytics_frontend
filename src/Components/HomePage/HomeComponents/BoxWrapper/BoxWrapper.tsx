import React from "react";
import { Box, SxProps, Typography } from "@mui/material";

interface BoxWrapperProps {
  children?: JSX.Element[] | JSX.Element;
  title: string;
  boxSX?: SxProps;
  titleSX?: SxProps;
  valueSX?: SxProps;
  value?: React.ReactNode | string;
}

const BoxWrapper: React.FC<BoxWrapperProps> = ({
  children,
  title,
  value,
  boxSX,
  titleSX,
  valueSX,
}) => {
  return (
    <Box
      sx={{
        border: "1px solid #FA939B",
        borderRadius: 4,
        padding: "26px 25px",
        background: "#28292A",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        ...boxSX,
      }}
    >
      <Typography variant="h6" color="white" mb={0.5} sx={{ ...titleSX }}>
        {title}
      </Typography>
      {value ? (
        <Typography variant="h5" color="white" sx={{ ...valueSX }}>
          {value}
        </Typography>
      ) : (
        children
      )}
    </Box>
  );
};

export default BoxWrapper;
