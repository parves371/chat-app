import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import React from "react";
// Todo Transform
const AvaterCard = ({ avater = [], max = 4 }) => {
  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup max={max}>
        <Box width={"5rem "} height={"3rem"}>
          {avater.map((i, index) => {
            return (
              <Avatar
                src={i}
                alt={`avater ${index}`}
                key={Math.random() * 100}
                sx={{
                  width: "3rem",
                  height: "3rem",
                  position: "absolute",
                  left: {
                    sx: `${0.5 + index}rem`,
                    sm: `${index}rem`,
                  },
                }}
              />
            );
          })}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvaterCard;
