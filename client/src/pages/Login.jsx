import React from "react";

import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
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

import { VisuallyHiddenInpute } from "../components/styles/StyledComponents";
import { bgGradient } from "../constants/color";
import { userNameValidation } from "../utils/validators";

import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const name = useInputValidation("", userNameValidation);
  const email = useInputValidation("");
  // useStrongPassword();
  const password = useInputValidation("");
  const bio = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleSingIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading("logging in...");
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
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSingUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading("creating account...");
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
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
