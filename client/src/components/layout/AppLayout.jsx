import React, { useCallback } from "react";
import { useParams } from "react-router-dom";

import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Header from "./Header";

import { Drawer, Grid, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { NEW_MASSAGE, NEW_REQUEST } from "../../constants/event";
import { useErrorHook, useSocketEvents } from "../../hooks/hook";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotificationsCount,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import { setIsMobileMenuFriend } from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import ProfileCard from "../specific/ProfileCard";
const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;

    const socket = getSocket();
    // redux
    const dispatch = useDispatch();

    const { isMobileMenuFriend } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    //  rtk query
    const { isLoading, data, error, isError, refetch } = useMyChatsQuery("");

    useErrorHook([{ isError, error }]);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("delete chat", _id, groupChat);
    };

    const handleMobileMenuFriendClose = () =>
      dispatch(setIsMobileMenuFriend(!isMobileMenuFriend));

    // use socket events

    const newMessagesAlertHandler = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestHandler = useCallback(
      (data) => {
        dispatch(incrementNotificationsCount());
      },
      [dispatch]
    );
    const eventArr = {
      [NEW_MASSAGE]: newMessagesAlertHandler, // alert for new message
      [NEW_REQUEST]: newRequestHandler, // alert for sent friend request and get new notification
    };

    useSocketEvents(socket, eventArr);

    return (
      <>
        <Title title="TalkWave" />
        <Header />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer
            open={isMobileMenuFriend}
            onClose={handleMobileMenuFriendClose}
          >
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMassagesAlert={newMessagesAlert}
            />
          </Drawer>
        )}
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{ display: { sx: "none", sm: "block" } }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMassagesAlert={newMessagesAlert}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { sx: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <ProfileCard user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
