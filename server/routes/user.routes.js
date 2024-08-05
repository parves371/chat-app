import express from "express";
import {
  getMyProfile,
  login,
  logout,
  newUser,
} from "../controlers/user.controlers.js";
import { singleAvatar } from "../middlewares/multer.middlewares.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.post("/login", login);
app.post("/new", singleAvatar, newUser);

// after here user must be logged in to access the routes
app.use(isAuthenticated);
app.get("/me", getMyProfile);
app.get("/logout", logout);

export default app;
