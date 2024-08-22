import React from "react";

import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";

import { VisuallyHiddenInpute } from "../components/styles/StyledComponents";
import { userNameValidation } from "../utils/validators";
import { bgGradient } from "../constants/color";

import axios from "axios";
import { server } from "../constants/config";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import toast from "react-hot-toast";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const name = useInputValidation("", userNameValidation);
  const email = useInputValidation("");
  // useStrongPassword();
  const password = useInputValidation("");
  const bio = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleSingIn = async (e) => {
    e.preventDefault();
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: email.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(true));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };
  const handleSingUp = async (e) => {
    e.preventDefault();
    const fromData = new FormData();
    fromData.append("avatar", avatar.file);
    fromData.append("name", name.value);
    fromData.append("bio", bio.value);
    fromData.append("username", email.value);
    fromData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        fromData,
        config
      );
      dispatch(userExists(true));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };
  return (
    <div
      style={{
        backgroundImage: bgGradient,
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLoggedIn ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form style={{ width: "100%", marginTop: "1rem" }}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email.value}
                  onChange={email.changeHandler}
                />

                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  autoFocus
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  onClick={handleSingIn}
                >
                  Login
                </Button>
                <Typography align="center" m={"1rem"}>
                  OR
                </Typography>

                <Button
                  variant="text"
                  onClick={() => setIsLoggedIn(false)}
                  fullWidth
                >
                  sign up
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">sign up</Typography>
              <form style={{ width: "100%", marginTop: "1rem" }}>
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      color: "white",
                      bgcolor: "rgba(0, 2, 0, 0.15)",
                      ":hover": {
                        bgcolor: "rgba(255, 255, 255, 0.25)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInpute
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography
                    variant="caption"
                    color="red"
                    m={"1rem auto"}
                    display={"block"}
                    width={"fit-content"}
                  >
                    {avatar.error}
                  </Typography>
                )}

                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="username"
                  name="name"
                  value={name.value}
                  onChange={name.changeHandler}
                />
                {name.error && (
                  <Typography color={"error"} variant="caption">
                    {name.error}
                  </Typography>
                )}
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="bio"
                  label="bio"
                  name="bio"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email.value}
                  onChange={email.changeHandler}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  autoFocus
                  value={password.value}
                  onChange={password.changeHandler}
                />
                {password.error && (
                  <Typography color={"error"} variant="caption">
                    {password.error}
                  </Typography>
                )}
                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  onClick={handleSingUp}
                >
                  sign up
                </Button>
                <Typography align="center" m={"1rem"}>
                  OR
                </Typography>

                <Button
                  variant="text"
                  onClick={() => setIsLoggedIn(true)}
                  fullWidth
                >
                  login instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
