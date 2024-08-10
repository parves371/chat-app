import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendattachment,
} from "../controlers/chat.controlers.js";
import { attachmentMulter } from "../middlewares/multer.middlewares.js";

const app = express.Router();

// after here user must be logged in to access the routes
app.use(isAuthenticated);
app.post("/new-chat", newGroupChat);
app.get("/get-my-chats", getMyChats);
app.get("/get-my-groups", getMyGroups);
app.put("/addmember", addMembers);
app.put("/remove-member", removeMember);
app.delete("/leave/:id", leaveGroup);

// send attachments
app.post("/send-attachment", attachmentMulter, sendattachment);

// get massages
// get chat deatails reame delete
app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default app;
