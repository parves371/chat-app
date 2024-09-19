import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";

import {
  Box,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  NotificationAdd as NotificationIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import moment from "moment";

import {
  CurveButton,
  SearchBox,
} from "../../components/styles/StyledComponents";
import { matblack } from "../../constants/color";
import { DoughnutCharts, LineCharts } from "../../components/specific/Charts";

import { useFetchData } from "6pp";
import { server } from "../../constants/config";
import { useErrorHook } from "../../hooks/hook";
const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/get-stats`,
    "dashboard-stats"
  );

  const { stats } = data || {};

  useErrorHook([
    {
      isError: error,
      error: error,
    },
  ]);

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

  const widgets = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent={"space-between"}
      alignItems={"center"}
      margin={"2rem 0"}
      spacing={"2rem"}
    >
      <Widget title="Users" value={stats?.userscount} icon={<PersonIcon />} />
      <Widget
        title="Chats"
        value={stats?.totalchatsCount}
        icon={<GroupIcon />}
      />
      <Widget
        title="Messages"
        value={stats?.messagecount}
        icon={<MessageIcon />}
      />
    </Stack>
  );
  return loading ? (
    <Skeleton />
  ) : (
    <AdminLayout>
      <Container component={"main"}>
        {appbar}
        <Stack
          direction={{ xs: "column", lg: "row" }}
          alignItems={{ xs: "center", lg: "stretch" }}
          flexWrap={"wrap"}
          justifyContent={"center"}
          sx={{ gap: "2rem" }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "2rem 3.5rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
            }}
          >
            <Typography margin={"2rem 0"} variant="h4">
              Last Massages
            </Typography>
            <LineCharts value={stats?.messagesChart} />
          </Paper>
          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              borderRadius: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", sm: "50%" },
              position: "relative",
              width: "100%",
              maxWidth: "25rem",
            }}
          >
            <DoughnutCharts
              labels={["Single Chats", "Group Chats"]}
              value={[
                stats?.totalchatsCount - stats?.groupscount || 0,
                stats?.groupscount || 0,
              ]}
            />
            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"0.5rem"}
              width={"100%"}
              height={"100%"}
            >
              <GroupIcon /> <Typography>Vs</Typography> <PersonIcon />
            </Stack>
          </Paper>
        </Stack>
        {widgets}
      </Container>
    </AdminLayout>
  );
};

const Widget = ({ title, value, icon }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1.5rem",
      width: "20rem",
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography>{title}</Typography>
      {icon}
      <Typography
        sx={{
          color: "rgba(0,0,0,0.7)",
          borderRadius: "50%",
          border: `5px solid ${matblack}`,
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value}
      </Typography>
    </Stack>
  </Paper>
);

export default Dashboard;
