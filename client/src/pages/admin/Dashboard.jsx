import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  NotificationAdd as NotificationIcon,
} from "@mui/icons-material";
import moment from "moment";
import {
  CurveButton,
  SearchBox,
} from "../../components/styles/StyledComponents";

const Dashboard = () => {
  const appbar = (
    <Paper
      elevation={3}
      sx={{
        padding: "2rem",
        margin: "2rem 0",
        borderRadius: "1rem",
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} />
        <SearchBox placeholder="Search..." />
        <CurveButton>Search</CurveButton>
        <Box flexGrow={1} />
        <Typography
          display={{ xs: "none", lg: "block" }}
          color={"rgba(0,0,0,0.7)"}
          textAlign={"center"}
        >
          {moment().format("dddd, D  MMMM YYYY")}
        </Typography>
        <NotificationIcon />
      </Stack>
    </Paper>
  );

  const widgets = <></>;
  return (
    <AdminLayout>
      <Container component={"main"}>
        {appbar}
        <Stack>char area</Stack>
        {widgets}
      </Container>
    </AdminLayout>
  );
};

export default Dashboard;
