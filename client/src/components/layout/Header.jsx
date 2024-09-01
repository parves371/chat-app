import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  NotificationAdd as NotificationIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense, lazy, useState } from "react";
import { orange } from "../../constants/color";

import { useNavigate } from "react-router-dom";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationsDialog = lazy(() => import("../specific/Notifications"));
const NewGroupsDialog = lazy(() => import("../specific/NewGroups"));

import axio from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../constants/config";
import { userNotExists } from "../../redux/reducers/auth";
import {
  setIsMobileMenuFriend,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationsCount } from "../../redux/reducers/chat";
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification, isnewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationsCount } = useSelector((state) => state.chat);

  const handleMobile = () => dispatch(setIsMobileMenuFriend(true)); // open mobile menu
  const openSearchbox = () => dispatch(setIsSearch(true)); // open search dialog
  const openNewGroup = () => dispatch(setIsNewGroup(true)); // open new group dialog
  const navigateToGroup = () => navigate("/groups");
  const openNotification = () => {
    dispatch(setIsNotification(true)); // open notifications dialog
    dispatch(resetNotificationsCount()); // reset notifications count
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axio.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };
  return (
    <>
      <Box sx={{ flexFlow: "1" }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              TalkWave
            </Typography>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: "1" }} />
            <Box>
              <IconsBtn
                title="search"
                onClick={openSearchbox}
                icon={<SearchIcon />}
              />
              <IconsBtn
                title="Create New Group"
                onClick={openNewGroup}
                icon={<AddIcon />}
              />
              <IconsBtn
                title="Manage Groups"
                onClick={navigateToGroup}
                icon={<GroupIcon />}
              />
              <IconsBtn
                title="Notification"
                onClick={openNotification}
                icon={<NotificationIcon />}
                value={notificationsCount}
              />
              <IconsBtn
                title="Logout"
                onClick={logoutHandler}
                icon={<LogoutIcon />}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {isSearch && (
        <Suspense fallback={<Backdrop open={true} />}>
          <SearchDialog />
        </Suspense>
      )}
      {isnewGroup && (
        <Suspense fallback={<Backdrop open={true} />}>
          <NewGroupsDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open={true} />}>
          <NotificationsDialog />
        </Suspense>
      )}
    </>
  );
};

const IconsBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? <Badge badgeContent={value}>{icon}</Badge> : icon}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
