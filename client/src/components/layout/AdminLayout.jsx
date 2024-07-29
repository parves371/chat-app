import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import {
  Close as ClosedIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ManageAccounts as ManageAccountsIcon,
  Groups as GroupsIcon,
  Message as MessageIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import React, { useState } from "react";
import { useLocation, Link as LinkComponent, Navigate } from "react-router-dom";
import { matblack } from "../../constants/color";

const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;
const adminTab = [
  { name: "Dashboard", url: "/admin/dashboard", icon: <DashboardIcon /> },
  {
    name: "Users",
    url: "/admin/user",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "chats",
    url: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "messages",
    url: "/admin/messages",
    icon: <MessageIcon />,
  },
];
const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();

  const logoutHandler = () => {};

  return (
    <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
      <Typography variant="h5">Admin</Typography>
      <Stack spacing={"1rem"}>
        {adminTab.map((tab) => (
          <Link
            key={tab.url}
            to={tab.url}
            sx={
              location.pathname === tab.url && {
                backgroundColor: matblack,
                color: "white",
                ":hover": { color: "white" },
              }
            }
          >
            <Stack spacing={"1rem"} direction={"row"} alignItems={"center"}>
              {tab.icon}
              <Typography variant="body1">{tab.name}</Typography>
            </Stack>
          </Link>
        ))}
        <Link onClick={logoutHandler}>
          <Stack spacing={"1rem"} direction={"row"} alignItems={"center"}>
            <LogoutIcon />
            <Typography variant="body1">Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

const isAdmin = true;
const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);
  const handleClose = () => setIsMobile(false);

  if (!isAdmin) return <Navigate to={"/admin"} />;

  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <ClosedIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Grid item md={4} lg={3} sx={{ display: { xs: "none", sm: "block" } }}>
        <Sidebar />
      </Grid>
      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{
          bgcolor: "#cfe8fc",
        }}
      >
        {children}
      </Grid>
      <Drawer open={isMobile} onClose={handleClose}>
        <Sidebar w="50vw" />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
