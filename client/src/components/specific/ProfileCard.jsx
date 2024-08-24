import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalenderIcon,
} from "@mui/icons-material";

import momemt from "moment";
import { fileTransform } from "../../lib/features";
const ProfileCard = ({ user }) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        src={fileTransform(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "2px solid #fff",
        }}
      />
      <Profile text={"Bio"} heading={user?.bio} />
      <Profile
        text={"username"}
        heading={user?.username}
        icon={<UserNameIcon />}
      />
      <Profile text={"name"} heading={user?.name} icon={<FaceIcon />} />
      <Profile
        text={"joined"}
        heading={momemt(user?.createdAt).fromNow()}
        icon={<CalenderIcon />}
      />
    </Stack>
  );
};

const Profile = ({ text, icon, heading }) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"1rem"}
      color={"white"}
      textAlign={"center"}
    >
      {icon && icon}
      <Stack>
        <Typography variant="body1">{text}</Typography>
        <Typography color={"gray"} variant="caption">
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default ProfileCard;
