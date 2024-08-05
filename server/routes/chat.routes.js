import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { newGroupChat } from "../controlers/chat.controlers.js";

const app = express.Router();

// after here user must be logged in to access the routes
app.use(isAuthenticated);
app.post("/new-chat", newGroupChat);

export default app;
