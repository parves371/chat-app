import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import AvaterCard from "./AvaterCard";
import { fileTransform } from "../../lib/features";

const Chatitem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMassageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the default context menu
    handleDeleteChat(e, _id, groupChat); // Call the delete function
  };

  return (
    <Link
      sx={{ padding: "0" }}
      to={`/chat/${_id}`}
      onContextMenu={handleContextMenu} // Use the context menu handler
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
        }}
      >
        <AvaterCard avater={fileTransform(avatar)} />
        <Stack>
          <Typography>{name}</Typography>
          {newMassageAlert && (
            <Typography>{newMassageAlert.count} New Message</Typography>
          )}
        </Stack>
        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </div>
    </Link>
  );
};

export default memo(Chatitem);
