import React from "react";
import { Stack } from "@mui/material";

import Chatitem from "../shared/Chatitem";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMassagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <Stack width={w} direction={"column"} sx={{ overflowY: "auto" }} height={"100%"}>
      {chats?.map((chat, index) => {
        const { _id, name, avatar, members, groupChat } = chat;

        const newMassageAlert = newMassagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        const isOnline = members?.some((member) => onlineUsers.includes(_id));
        return (
          <Chatitem
            index={index}
            newMassageAlert={newMassageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};
export default ChatList;
