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
import { useInputValidation } from "6pp";

import { VisuallyHiddenInpute } from "../components/styles/StyledComponents";
const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const name = useInputValidation("", "name", "required|min:3|max:20");
  const email = useInputValidation("", "email", "required|email");
  const password = useInputValidation("", "password", "required|min:6|max:20");
  const bio = useInputValidation("", "bio", "min:10|max:100");
  return (
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
                id="email"
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
                    <VisuallyHiddenInpute type="file" />
                  </>
                </IconButton>
              </Stack>

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
              <Button
                sx={{
                  marginTop: "1rem",
                }}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
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
  );
};

export default Login;
