import express from "express";
import {
  acceptFriendRequest,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendRequest,
} from "../controlers/user.controlers.js";
import { singleAvatar } from "../middlewares/multer.middlewares.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  acceptFriendRequestValidator,
  loginValidator,
  registerValidator,
  sendFriendRequestValidator,
  validate,
} from "../lib/validator.js";

const app = express.Router();

app.post("/new", singleAvatar, registerValidator(), validate, newUser);
app.post("/login", loginValidator(), validate, login);

// after here user must be logged in to access the routes
app.use(isAuthenticated);
app.get("/me", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);
app.put("/send-request", sendFriendRequestValidator(), validate, sendRequest);
app.put(
  "/accept-request",
  acceptFriendRequestValidator(),
  validate,
  acceptFriendRequest
);
app.get("/notification", getMyNotifications);


export default app;
