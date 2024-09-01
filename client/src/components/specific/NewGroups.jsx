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

import { sampleUser } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";
import { useDispatch } from "react-redux";
import { useAvailableFriendsDetailsQuery } from "../../redux/api/api";
import { useErrorHook } from "../../hooks/hook";

const NewGroups = () => {
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsDetailsQuery();
  console.log(data);
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
    console.log(groupName.value, selectedMembers);
  };
  const closeHandler = () => {};
  return (
    <Dialog open onClose={closeHandler}>
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
          <Button variant="text" color="error" size="large">
            Cancel
          </Button>
          <Button variant="contained" size="large" onClick={submitHandler}>
            {" "}
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroups;
