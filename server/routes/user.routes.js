import express from "express";
import { getMyProfile, login, newUser } from "../controlers/user.controlers.js";
import { singleAvatar } from "../middlewares/multer.middlewares.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.post("/login", login);
app.post("/new", singleAvatar, newUser);

// after here user must be logged in to access the routes
app.get("/me", isAuthenticated, getMyProfile);

export default app;
