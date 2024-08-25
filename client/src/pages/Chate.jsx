import { IconButton, Skeleton, Stack } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import { InputBox } from "../components/styles/StyledComponents";
import { gray, orange } from "../constants/color";
import { NEW_MASSAGES } from "../constants/event";
import { sampleMessage } from "../constants/sampleData";
import { useChatDetailsQuery } from "../redux/api/api";
import { getSocket } from "../socket";
import { useErrorHook, useSocketEvents } from "../hooks/hook";

const Chate = ({ chatId, user }) => {
  const containerRef = useRef(null);

  const socket = getSocket();
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const erros = [{ isError: chatDetails.isError, error: chatDetails.error }];

  const [message, setMessage] = useState(""); //on change event
  const members = chatDetails.data?.chat?.members;

  const [messages, setMessages] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // emiiting event to the server
    socket.emit(NEW_MASSAGES, {
      chatId,
      members,
      message,
    });
    setMessage("");
  };

  const newMessagesHandler = useCallback((data) => {
    setMessages((prev) => [...prev, data.message]);
  }, []);
  const eventArr = {
    [NEW_MASSAGES]: newMessagesHandler,
  };

  useSocketEvents(socket, eventArr);
  useErrorHook(erros); // show error toast

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        spacing={"1rem"}
        padding={"1rem"}
        height={"90%"}
        bgcolor={gray}
        sx={{ overflowY: "auto", overflowX: "hidden" }}
      >
        {messages?.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
      </Stack>
      <form style={{ height: "10%" }} onSubmit={submitHandler}>
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          position={"relative"}
          alignItems={"center"}
        >
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <InputBox
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            type="submit"
            sx={{
              backgroundColor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                backgroundColor: "error.main",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu />
    </>
  );
};

export default AppLayout()(Chate);
