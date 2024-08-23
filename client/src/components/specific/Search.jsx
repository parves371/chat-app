import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { useInputValidation } from "6pp";

import UserItem from "../shared/UserItem";

import { useDispatch, useSelector } from "react-redux";
import { useLazySearchUserQuery } from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";

const Search = () => {
  const dispatch = useDispatch();
  const { isSearch } = useSelector((state) => state.misc); // redux-toolkit

  const [searchUser] = useLazySearchUserQuery();

  const isLoadingSendFriendRequest = false;
  const addFriendHandler = (id) => {};

  const [users, setUsers] = useState([]);
  const search = useInputValidation("");

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (search.value.length > 0) {
        searchUser(search.value).then((res) => {
          setUsers(res.data.users);
        });
      } else {
        setUsers([]);
      }
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [search.value]);

  const searchCloseHandler = () => dispatch(setIsSearch(false)); // redux-toolkit
  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
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
          {users &&
            users.map((i) => {
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
