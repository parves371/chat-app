import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import { lightBlue } from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/features";

const MessageComponent = ({ message, user }) => {
  const { content, attachments = [], sender, createdAt } = message;

  const sameSender = sender?._id === user?._id;

  const timeAgo = moment(createdAt).fromNow();
  return (
    <div
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"600"}>
          {sender.name}
        </Typography>
      )}

      {content && <Typography>{content}</Typography>}
      {attachments.length > 0 &&
        attachments.map((i, index) => {
          const { public_id, url } = i;
          const file = fileFormat(url);
          return (
            <Box key={index}>
              <a
                href=""
                target="_blank"
                download
                style={{ color: "black" }}
              ></a>
            </Box>
          );
        })}
      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </div>
  );
};

export default memo(MessageComponent);
