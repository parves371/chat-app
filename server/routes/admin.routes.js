import express from "express";
import {
  allUsers,
  getChats,
  getMessages,
} from "../controlers/admin.controlers.js";

const app = express.Router();

app.get("/");

app.post("/verify");
app.get("/logout");

app.get("/get-user", allUsers);
app.get("/get-chats", getChats);
app.get("/get-messages", getMessages);
app.get("/stats");

export default app;
