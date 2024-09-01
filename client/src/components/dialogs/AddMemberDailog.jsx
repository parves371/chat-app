import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import UserItem from "../shared/UserItem";

import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrorHook } from "../../hooks/hook";
import {
  useAddGroupMemberMutation,
  useAvailableFriendsDetailsQuery,
} from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducers/misc";
const AddMemberDailog = ({ chatId }) => {
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const { isError, isLoading, error, data } =
    useAvailableFriendsDetailsQuery(chatId);

  const {
    executeMutation: addGroupMember,
    isLoading: addGroupMemberIsLoading,
  } = useAsyncMutation(useAddGroupMemberMutation);

  const errors = [{ isError, error }];
  useErrorHook(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id]
    );
  };
  const closeHandler = () => dispatch(setIsAddMember(false));

  const addMemberSubmitHandler = () => {
    addGroupMember("Adding members", {
      chatId,
      members: selectedMembers,
    });
    closeHandler();
  };
  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"1rem"}>
        <DialogTitle> Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          {isLoading ? (
            <Skeleton />
          ) : data?.myFriends?.length > 0 ? (
            data?.myFriends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}> no friends</Typography>
          )}
        </Stack>
        <Stack spacing={"1rem"}>
          <Button color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={addMemberSubmitHandler}
            disabled={addGroupMemberIsLoading}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDailog;
