import express from "express";
import {
  adminLogin,
  adminLogout,
  allUsers,
  getAdminData,
  getChats,
  getdashboardStats,
  getMessages,
} from "../controlers/admin.controlers.js";
import { adminLoginValidator, validate } from "../lib/validator.js";
import { isAdmin } from "../middlewares/auth.js";

const app = express.Router();

app.post("/verify", adminLoginValidator(), validate, adminLogin);
app.get("/logout", adminLogout);
// only admin can access this routes
app.use(isAdmin);

app.get("/", getAdminData);

app.get("/get-user", allUsers);
app.get("/get-chats", getChats);
app.get("/get-messages", getMessages);
app.get("/get-stats", getdashboardStats);

export default app;
