import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

import { Search as SearchIcon } from "@mui/icons-material";
import { useInputValidation } from "6pp";

import UserItem from "../shared/UserItem";
import { sampleUser } from "../../constants/sampleData";
const Search = () => {
  const search = useInputValidation("");

  const isLoadingSendFriendRequest = false;
  const addFriendHandler = (id) => {};

  const [Users, setUsers] = useState(sampleUser);
  return (
    <Dialog open>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Search</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "rgba(0,0,0,0.5)" }} />
              </InputAdornment>
            ),
          }}
        />
        <List>
          {Users.map((i) => {
            return (
              <UserItem
                user={i}
                key={i._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            );
          })}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
