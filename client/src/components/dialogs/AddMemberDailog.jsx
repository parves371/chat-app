import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { sampleUser } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
const AddMemberDailog = ({ addMember, isLoadingAddMember, chatId }) => {
  const [members, setMembers] = useState(sampleUser);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id]
    );
  };
  const closeHandler = () => {
    setSelectedMembers([]);
    setMembers([]);
  };
  const addMemberSubmitHandler = () => {
    closeHandler();
  };
  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"1rem"}>
        <DialogTitle> Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          {members.length > 0 ? (
            members.map((i) => (
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
          <Button color="error">Cancel</Button>
          <Button
            variant="contained"
            onClick={addMemberSubmitHandler}
            disabled={isLoadingAddMember}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDailog;
