import React from "react";
import { useParams } from "react-router-dom";

import Header from "./Header";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import { sampleChat } from "../../constants/sampleData";

import { Grid, Skeleton } from "@mui/material";
import ProfileCard from "../specific/ProfileCard";
import { useMyChatsQuery } from "../../redux/api/api";
const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;
    //  rtk query
    const { isLoading, data, error, isError, refetch } = useMyChatsQuery("");
    console.log(data);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("delete chat", _id, groupChat);
    };
    return (
      <>
        <Title title="TalkWave" />
        <Header />
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
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} />
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
            <ProfileCard />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
