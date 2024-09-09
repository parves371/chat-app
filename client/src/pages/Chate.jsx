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
import { useNavigate } from "react-router-dom";
import { TypingLoader } from "../components/layout/Loaders";
import {
  ALERT,
  NEW_MASSAGES,
  START_TYPING,
  STOP_TYPING,
} from "../constants/event";
import { useErrorHook, useSocketEvents } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { removeNewMessageAlert } from "../redux/reducers/chat";
import { setIsFileMenu } from "../redux/reducers/misc";
import { getSocket } from "../socket";

const Chate = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const socket = getSocket();
  const dispatch = useDispatch();

  const [message, setMessage] = useState(""); //on change event
  const [messages, setMessages] = useState([]); // socket messages
  const [page, setPage] = useState(1);
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const typingTimeout = useRef(null);

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

  const onChangeMessage = (e) => {
    setMessage(e.target.value); // storring message in state from input box
    if (!isTyping) {
      socket.emit(START_TYPING, {
        chatId,
        members,
      });
      setIsTyping(true);
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, {
        chatId,
        members,
      });
      setIsTyping(false);
    }, 2000);
  };

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

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!chatDetails?.data?.chat) return navigate("/");
  }, [chatDetails.data]);
  const newMessagesHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return; //
      setMessages((prev) => [...prev, data.message]); // fetch feom sockets and user messege store in prev
    },
    [chatId]
  );
  const startTypingHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return; //
      setUserTyping(true);
    },
    [chatId]
  );
  const stopTypingHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return; //
      setUserTyping(false);
    },
    [chatId]
  );
  const alertHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return; //
      const realTimeMessage = {
        content: data.message,
        sender: {
          _id: "dklsdmlsdla",
          name: "Admin",
        },
        chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, realTimeMessage]);
    },
    [chatId]
  );

  const eventArr = {
    [ALERT]: alertHandler,
    [NEW_MASSAGES]: newMessagesHandler,
    [START_TYPING]: startTypingHandler,
    [STOP_TYPING]: stopTypingHandler,
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

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />
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
            onChange={onChangeMessage}
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
