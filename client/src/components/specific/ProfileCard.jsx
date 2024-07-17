import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalenderIcon,
} from "@mui/icons-material";

import momemt from "moment";
const ProfileCard = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "2px solid #fff",
        }}
      />
      <Profile text={"Bio"} heading={"I am a developer"} />
      <Profile
        text={"username"}
        heading={"parves371"}
        icon={<UserNameIcon />}
      />
      <Profile
        text={"name"}
        heading={"md Parves Ahmed Shuvo"}
        icon={<FaceIcon />}
      />
      <Profile
        text={"joined"}
        heading={momemt("2024-01-01T06:00:02+06:00").fromNow()}
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
