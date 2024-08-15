import express from "express";
import {
  adminLogin,
  adminLogout,
  allUsers,
  getChats,
  getdashboardStats,
  getMessages,
} from "../controlers/admin.controlers.js";
import { adminLoginValidator, validate } from "../lib/validator.js";

const app = express.Router();

app.get("/");

app.post("/verify", adminLoginValidator(), validate, adminLogin);
app.get("/logout", adminLogout);

app.get("/get-user", allUsers);
app.get("/get-chats", getChats);
app.get("/get-messages", getMessages);
app.get("/get-stats", getdashboardStats);

export default app;
