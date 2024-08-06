import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  getMyChats,
  getMyGroups,
  newGroupChat,
} from "../controlers/chat.controlers.js";

const app = express.Router();

// after here user must be logged in to access the routes
app.use(isAuthenticated);
app.post("/new-chat", newGroupChat);
app.get("/get-my-chats", getMyChats);
app.get("/get-my-groups", getMyGroups);

export default app;
