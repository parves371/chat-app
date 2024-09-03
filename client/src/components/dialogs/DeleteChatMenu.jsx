import { Menu, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import { useSelector } from "react-redux";
import {
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hook";
import { useDeleteChatMutation } from "../../redux/api/api";

const DeleteChatMenu = ({ dispatch, deleteOptinAnchor }) => {
  const navigate = useNavigate();
  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  const { executeMutation, data } = useAsyncMutation(useDeleteChatMutation);

  const onCloseHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteOptinAnchor.current = null;
  };

  const leaveGroup = () => {};
  const deleteGroup = () => {
    executeMutation("Deleting Chat...", { chatId: selectedDeleteChat?.chatId });
    onCloseHandler();
  };
  useEffect(() => {
    if (data) navigate("/");
  }, [data]);
  return (
    <Menu
      open={isDeleteMenu}
      onClose={onCloseHandler}
      anchorEl={deleteOptinAnchor}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Stack
        sx={{ width: "10rem", padding: "0.5rem", cursor: "pointer" }}
        direction={"row"}
        alignItems={"center"}
        spacing={1}
        onClick={selectedDeleteChat?.groupChat ? leaveGroup : deleteGroup}
      >
        {selectedDeleteChat?.groupChat ? (
          <>
            <ExitToAppIcon />
            <Typography>Leave Group</Typography>
          </>
        ) : (
          <>
            <DeleteIcon />
            <Typography>Delete Chat</Typography>
          </>
        )}
      </Stack>
    </Menu>
  );
};

export default DeleteChatMenu;
