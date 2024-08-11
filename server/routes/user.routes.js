import express from "express";
import {
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
} from "../controlers/user.controlers.js";
import { singleAvatar } from "../middlewares/multer.middlewares.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  loginValidator,
  registerValidator,
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

export default app;
