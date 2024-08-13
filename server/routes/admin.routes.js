import express from "express";
import { allUsers } from "../controlers/admin.controlers.js";

const app = express.Router();

app.get("/");

app.post("/verify");
app.get("/logout");

app.get("/get-user", allUsers);
app.get("/chats");
app.get("/messages");
app.get("/stats");

export default app;
