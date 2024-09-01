import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { useInputValidation } from "6pp";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrorHook } from "../../hooks/hook";
import {
  useAvailableFriendsDetailsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const NewGroups = () => {
  const dispatch = useDispatch();
  const { isnewGroup } = useSelector((state) => state.misc);

  const { isError, isLoading, error, data } = useAvailableFriendsDetailsQuery();
  const newGroupExecuteMutation = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [{ isError, error }];
  useErrorHook(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Enter Group Name");
    if (selectedMembers.length < 2)
      return toast.error("Select atleast 2 members");

    newGroupExecuteMutation.executeMutation("Creating Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };
  const closeHandler = () => dispatch(setIsNewGroup(false));
  return (
    <Dialog open={isnewGroup} onClose={closeHandler}>
      <Stack p={{ SX: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          new groups
        </DialogTitle>
        <TextField
          value={groupName.value}
          onChange={groupName.changeHandler}
          variant="outlined"
          size="small"
          label="Group Name"
        />
        <Typography variant="body1">Member</Typography>
        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data.myFriends?.map((i) => {
              return (
                <UserItem
                  user={i}
                  key={i._id}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers.includes(i._id)}
                />
              );
            })
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="text"
            color="error"
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={submitHandler}
            disabled={newGroupExecuteMutation.isLoading}
          >
            {" "}
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroups;
