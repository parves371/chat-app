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

import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { NEW_MASSAGES } from "../constants/event";
import { useErrorHook, useSocketEvents } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { setIsFileMenu } from "../redux/reducers/misc";
import { getSocket } from "../socket";
import { removeNewMessageAlert } from "../redux/reducers/chat";

const Chate = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();

  const [message, setMessage] = useState(""); //on change event
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  // using custom hook  libary 6pp to handle infinite scroll
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const erros = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails.data?.chat?.members;

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchorEl(e.currentTarget);
  };

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

  useEffect(() => {
    dispatch(removeNewMessageAlert(chatId));
    return () => {
      setMessages([]);
      setOldMessages([]);
      setMessage("");
      setPage(1);
    };
  }, [chatId]);
  const newMessagesHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return; // 
      setMessages((prev) => [...prev, data.message]); // fetch feom sockets and user messege store in prev
    },
    [chatId]
  );

  const eventArr = {
    [NEW_MASSAGES]: newMessagesHandler,
  };

  useSocketEvents(socket, eventArr);
  useErrorHook(erros); // show error toast

  const allMessages = [...oldMessages, ...messages];

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
        {allMessages?.map((i) => (
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
          <IconButton onClick={handleFileOpen}>
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
      <FileMenu anchorEl={fileMenuAnchorEl} chatId={chatId} />
    </>
  );
};

export default AppLayout()(Chate);
